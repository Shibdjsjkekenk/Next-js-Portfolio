"use client";

import { Fragment, useEffect, useRef } from "react";
import gsap from "gsap";
import { STATS, STICKERS } from "@/data/impact";
import PlusAnchor from "@/components/client-view/plus/PlusAnchor";
import { createImpactScene, type ImpactScene } from "@/lib/impact/createScene";
import s from "./ImpactStory.module.css";

const N = 6; // intro + heading + 4 stats
const TITLE = "IMPACT".split("");
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
/** how each chapter's panel enters: from below / right / above / left ... (px, px, deg) */
const PLUS_ROT = [[8, -22, 3], [6, 22, -3], [8, -18, 2], [6, 20, -2]] as const; // resting angle of the shared plus at each stat
const OX = [0, 0, 170, 0, -170, 0], OY = [0, 130, 0, -140, 0, 130], OR = [0, 0, 7, -7, 7, 0];

/** Heading split into words so they can light up on scroll */
const Words = ({ text }: { text: string }) => (
  <>
    {text.split(" ").map((w, i) => (
      <Fragment key={i}>
        <span data-w className={s.w}>{w}</span>{" "}
      </Fragment>
    ))}
  </>
);

export default function ImpactStory() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const vt = useRef<HTMLDivElement>(null);
  const star = useRef<HTMLDivElement>(null);
  const panels = useRef<(HTMLDivElement | null)[]>([]);
  const nums = useRef<(HTMLElement | null)[]>([]);
  const tweens = useRef<(gsap.core.Tween | undefined)[]>([]);
  const letters = useRef<(HTMLSpanElement | null)[]>([]);
  const inner = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const root = section.current, cv = canvas.current, stg = stage.current;
    if (!root || !cv || !stg) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const words = Array.from(heading.current?.querySelectorAll<HTMLElement>("[data-w]") ?? []);
    const ins = inner.current.filter(Boolean) as HTMLElement[];

    /* ----- GSAP: intro entrance + hover ----- */
    const ctx = gsap.context(() => {
      if (reduce) return;
      gsap.from(ins, {
        y: -600, opacity: 0, duration: 1.5, ease: "bounce.out", stagger: 0.08, delay: 0.2,
        rotation: () => gsap.utils.random(-60, 60),
      });
      gsap.from(`.${s.st}`, { scale: 0, rotation: -30, opacity: 0, duration: 0.7, ease: "back.out(2.2)", stagger: 0.15, delay: 1.2 });
      gsap.utils.toArray<HTMLElement>(`.${s.st}`).forEach((el, i) =>
        gsap.to(el, { y: i % 2 ? -10 : 10, duration: 1.6 + i * 0.25, ease: "sine.inOut", yoyo: true, repeat: -1 })
      );
    }, root);

    const hovers = ins.map((el) => {
      const fn = () =>
        gsap.timeline()
          .to(el, { y: -50, rotation: gsap.utils.random(-20, 20), duration: 0.2 })
          .to(el, { y: 0, rotation: 0, duration: 0.9, ease: "elastic.out(1,.4)" });
      el.addEventListener("pointerenter", fn);
      return () => el.removeEventListener("pointerenter", fn);
    });

    /* ----- Three scene ----- */
    let three: ImpactScene | null = null;
    try { three = createImpactScene(cv); } catch { return () => { ctx.revert(); hovers.forEach((f) => f()); }; }

    const onResize = () => three?.resize();
    window.addEventListener("resize", onResize);

    const pointer = { x: 0, y: 0 }, pTarget = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      pTarget.x = e.clientX / innerWidth - 0.5;
      pTarget.y = e.clientY / innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onMove);

    let target = 0, t = 0, active = -1, visible = true, raf = 0;
    const onScroll = () => {
      const b = root.getBoundingClientRect();
      target = clamp(-b.top / Math.max(1, b.height - stg.offsetHeight), 0, 1);   // svh-based: stable while the phone URL bar shows/hides
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(stg);

    const countUp = (i: number) => {
      const el = nums.current[i - 2], stat = STATS[i - 2];
      if (!el || !stat) return;
      const o = { v: 0 };
      tweens.current[i]?.kill(); // restart-safe: each counter animates on its own
      tweens.current[i] = gsap.to(o, { v: stat.value, duration: 1.4, ease: "power2.out", onUpdate: () => { el.textContent = o.v.toFixed(stat.decimals); } });
    };

    const clock = performance.now();
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible || !three) return;

      t = reduce ? target : t + (target - t) * 0.07;
      pointer.x += (pTarget.x - pointer.x) * 0.05;
      pointer.y += (pTarget.y - pointer.y) * 0.05;
      const time = (performance.now() - clock) / 1000;
      three.render(t, time, pointer, Math.abs(target - t));

      /* panels: fade/slide by distance to their chapter */
      let cur = 0;
      panels.current.forEach((p, i) => {
        if (!p) return;
        let d = t - i / 5;
        if (i === 0 && d < 0) d = 0;
        if (i === N - 1 && d > 0) d = 0;
        let op = clamp((0.1 - Math.abs(d)) / 0.04, 0, 1);

        if (i === 0) {
          // intro: zoom THROUGH the title
          const u = clamp(t / 0.06, 0, 1);
          op = 1 - clamp((u - 0.45) / 0.55, 0, 1);
          p.style.setProperty("--s", (1 + u * u * 9).toFixed(3));
          p.style.setProperty("--y", "0px");
          p.style.filter = u > 0.3 ? `blur(${((u - 0.3) * 10).toFixed(1)}px)` : "none";
         
          letters.current.forEach((L, j) => {
            if (!L) return;
            const o = j - 2.5;
            L.style.transform = `translate(${o * u * u * 320}px, ${-u * u * 80}px) rotate(${o * u * 14}deg)`;
          });
        } else {
          const k = clamp(d / 0.1, -1, 1);
          p.style.setProperty("--s", (0.9 + 0.1 * op).toFixed(3));
          p.style.setProperty("--x", `${-OX[i] * k}px`);
          p.style.setProperty("--y", `${-OY[i] * k}px`);
          p.style.setProperty("--r", `${-OR[i] * k}deg`);
          // read by <SharedPlus />: how "present" this panel is (overlaps with its neighbours → the plus glides between them)
          p.dataset.plusPresence = clamp((0.14 - Math.abs(d)) / 0.08, 0, 1).toFixed(3);
        }
        p.style.opacity = String(op);
        if (Math.abs(d) < 0.1) cur = i;
      });

      if (cur !== active) {
        active = cur;
        if (cur >= 2) countUp(cur);
      }

      const u = clamp((t - 0.12) / 0.12, 0, 1);
      words.forEach((w, j) => w.classList.toggle(s.on, j / words.length < u));
      if (vt.current) vt.current.style.opacity = String(clamp((t - 0.05) / 0.07, 0, 1));
      if (star.current) star.current.style.transform = `rotate(${t * 720}deg)`;
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      hovers.forEach((f) => f());
      ctx.revert();
      three?.dispose();
    };
  }, []);

  const setPanel = (i: number) => (el: HTMLDivElement | null) => { panels.current[i] = el; };

  return (
    <>
      <section ref={section} id="impact-story" className={s.story} aria-label="Why work with me">
        <div ref={stage} className={s.sticky}>
          <canvas ref={canvas} className={s.canvas} aria-hidden />
          <div className={s.glow} />
          <div ref={vt} className={s.vt}>IMPACT</div>
          <div ref={star} className={s.ast} aria-hidden>✱</div>

          {/* 0 · intro */}
          <div ref={setPanel(0)} className={`${s.panel} ${s.c}`}>
            <div className={s.tag}>✨ Why Work With Me</div>
            <div className={s.hw}>
              <h2 className={s.huge} aria-label="Impact">
                {TITLE.map((ch, i) => (
                  <span key={i} className={s.lt} ref={(el) => { letters.current[i] = el; }}>
                    <span
                      className={s.in}
                      ref={(el) => { inner.current[i] = el; }}
                      style={{ ["--sh" as string]: i % 2 ? "#f26b4f" : "#b6f02a" }}
                    >
                      {ch}
                    </span>
                  </span>
                ))}
              </h2>
              {STICKERS.map((txt, i) => (
                <span key={txt} className={`${s.st} ${s[`s${i + 1}`]}`}>{txt}</span>
              ))}
            </div>
            <div className={s.hint}>scroll to zoom in ↓</div>
          </div>
        

          {/* 1 · heading */}
          <div ref={setPanel(1)} className={`${s.panel} ${s.l}`}>
            <div className={s.eyebrow}>Why Work With Me</div>
            <h2 ref={heading} className={s.h}>
              <Words text="I build scalable web applications with" />
              <span data-w className={`${s.w} ${s.chip} ${s.c1}`}>&lt;/&gt;</span>{" "}
              <Words text="modern technologies, seamless user experiences" />
              <span data-w className={`${s.w} ${s.chip} ${s.c2}`}>✦</span>{" "}
              <Words text="and AI-powered solutions that solve real business" />
              <small data-w className={s.w}>problems.</small>
            </h2>
          </div>

          {/* 2‒5 · stats */}
          {STATS.map((st, i) => (
            <div key={st.label} ref={setPanel(i + 2)} className={`${s.panel} ${i % 2 ? s.l : s.r}`}>
              <div className={s.num}>
                <b ref={(el) => { nums.current[i] = el; }}>0</b>
                <PlusAnchor name={`stat-${i + 1}`} rot={PLUS_ROT[i]} />
              </div>
              <div className={s.lbl}>{st.label}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
