"use client";

import { useEffect, useRef, useState } from "react";

interface StatItem {
    value: number;
    decimals: number;
    suffix: string;
    label: string;
}

const STATS: StatItem[] = [
    { value: 3.2, decimals: 1, suffix: "+", label: "Years Experience" },
    { value: 12, decimals: 0, suffix: "+", label: "Projects Built" },
    { value: 20, decimals: 0, suffix: "+", label: "Technologies" },
    { value: 5, decimals: 0, suffix: "+", label: "AI Features Developed" },
];

/** Replace these with your own photos/screenshots */
const IMG_ONE =
    "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=300&auto=format&fit=crop&q=80";

const IMG_TWO =
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300&auto=format&fit=crop&q=80";

function useCountUp(target: number, decimals: number, active: boolean, duration = 1500) {
    const [value, setValue] = useState(0);
    const startRef = useRef<number | null>(null);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        if (!active) return;
        const ease = (t: number) => 1 - Math.pow(1 - t, 3);

        const step = (ts: number) => {
            if (startRef.current === null) startRef.current = ts;
            const progress = Math.min((ts - startRef.current) / duration, 1);
            setValue(target * ease(progress));
            if (progress < 1) rafRef.current = requestAnimationFrame(step);
        };
        rafRef.current = requestAnimationFrame(step);
        return () => {
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        };
    }, [active, target, duration]);

    return value.toFixed(decimals);
}

interface StatBlockProps {
    stat: StatItem;
    index: number;
    active: boolean;
}

function StatBlock({ stat, index, active }: StatBlockProps) {
    const display = useCountUp(stat.value, stat.decimals, active, 1300 + index * 150);

    return (
        <div className="hs-stat" style={{ transitionDelay: `${index * 100}ms` }} data-active={active}>
            <div className="hs-stat-number">
                {display}
                <span className="hs-stat-suffix">{stat.suffix}</span>
            </div>
            <div className="hs-stat-label">{stat.label}</div>
        </div>
    );
}

export default function HeroStats() {
    const [active, setActive] = useState(false);
    const rootRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const el = rootRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setActive(true);
                    obs.disconnect();
                }
            },
            { threshold: 0.3 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <section className="hs-root" ref={rootRef} data-active={active}>
            <style>{`
        .hs-root {
  --cream: #111;
  --cream-dim: #7a7a7a;
  --lime: #bbff00;
  --line: #7e7b7b;

  width: 100%;
  color: var(--cream);
  padding: 30px 0;
  overflow: hidden;
}

.hs-root *,
.hs-root *::before,
.hs-root *::after {
  box-sizing: border-box;
}

/* ================= TOP ================= */

.hs-top {
  display: grid;
  grid-template-columns: 90px 1fr 80px;
  gap: 30px;
  align-items: flex-start;
}

/* Left Label */

.hs-eyebrow {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-size: 36px;
  letter-spacing: .30em;
  text-transform: uppercase;
  color: #554e4e;
  font-weight: 700;
  user-select: none;
}

/* Heading */

.hs-headline-wrap {
  opacity: 0;
  transform: translateY(20px);
  transition: .7s ease;
}

.hs-root[data-active="true"] .hs-headline-wrap {
  opacity: 1;
  transform: translateY(0);
}

.hs-tag {
  font-size: 14px;
  color: var(--cream-dim);
  margin-bottom: 14px;
  letter-spacing: .08em;
}

.hs-headline {
  font-size: clamp(36px, 5vw, 51px);
  line-height: 1.30;
  font-weight: 600;
  letter-spacing: -.03em;
  margin: 0;
}

/* Inline Images */

.hs-inline-img {
  width: 44px;
  height: 44px;
  border-radius: 20%;
  object-fit: cover;
  display: inline-block;
  vertical-align: middle;
  margin: 0 6px;
}

.hs-inline-img:first-of-type {
  animation: hs-spin-left 5s linear infinite;
}

.hs-inline-img:last-of-type {
  animation: hs-spin-right 5s linear infinite;
}

@keyframes hs-spin-left {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes hs-spin-right {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}

/* Right Icon */

.hs-accent {
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
}

.hs-dot {
  display: none;
}

.hs-asterisk {
  width: 70px;
  height: 70px;
  color: #ED6E54;
  animation: hs-spin 8s linear infinite;
}

@keyframes hs-spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

/* ================= STATS ================= */

.hs-stats-row {
  margin-top: 25px;
  padding-top: 34px;
  border-top: 1px solid var(--line);

 display: flex;
  justify-content: flex-end;   /* Right side */
  align-items: flex-start;
  gap: 120px;
}

.hs-stat {
  opacity: 0;
  transform: translateY(20px);
  transition: .6s ease;
}

.hs-stat[data-active="true"] {
  opacity: 1;
  transform: translateY(0);
}

.hs-stat-number {
  font-size: clamp(42px, 5vw, 60px);
  font-weight: 700;
  line-height: 1;
}

.hs-stat-suffix {
  color: var(--lime);
}

.hs-stat-label {
  margin-top: 12px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: .08em;
  color: var(--cream-dim);
}

.content-span{
font-size:25px
}

/* ================= TABLET ================= */

@media (max-width:992px){

.hs-root{
padding:60px 0;
}

.hs-top{
grid-template-columns:1fr;
gap:24px;
}

.hs-eyebrow{
writing-mode:horizontal-tb;
transform:none;
font-size:12px;
letter-spacing:.3em;
}

.hs-headline{
font-size:42px;
line-height:1.25;
}

.hs-inline-img{
width:36px;
height:36px;
}

.hs-accent{
justify-content:flex-start;
}

.hs-asterisk{
width:55px;
height:55px;
}

.hs-stats-row{
grid-template-columns:repeat(2,1fr);
gap:30px;
}

}

/* ================= MOBILE ================= */

@media (max-width:768px){

/* Section */
.hs-root{
    padding:50px 0;
}

/* Top Layout */
.hs-top{
    display:flex;
    flex-direction:column;
    align-items:center;
    text-align:center;
    gap:18px;
}

/* IMPACT */
.hs-eyebrow{
    writing-mode:horizontal-tb;
    transform:none !important;
    font-size:12px;
    letter-spacing:.3em;
    text-align:center;
}

/* Why Work With Me */
.hs-tag{
    text-align:center;
    margin-bottom:14px;
}

/* Heading */
.hs-headline{
    font-size:24px;
    line-height:32px;
    text-align:center;
}

/* Images */
.hs-inline-img{
    width:24px;
    height:24px;
    margin:0 2px;
}

/* Hide icon */
.hs-accent{
    display:none;
}

/* Stats */
.hs-stats-row{
    display:grid;
    grid-template-columns:repeat(2,minmax(0,1fr));
        gap: 17px 18px;
        margin-top: 21px;
        padding-top: 21px;
}

/* Center each stat */
.hs-stat{
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    text-align:center;
    border:none;
    padding:0;
}

.hs-stat-number{
    font-size:34px;
}

.hs-stat-label{
    margin-top:8px;
    font-size:11px;
    line-height:1.5;
    letter-spacing:.08em;
    text-align:center;
}

}

/* Small Phones */

@media (max-width:480px){

.hs-headline{
font-size:26px;
}

.content-span{
font-size: 13px;
}

.hs-inline-img{
width:24px;
height:24px;
}

.hs-stat-number{
font-size:32px;
}

}

@media (prefers-reduced-motion: reduce){

.hs-root *{
animation:none !important;
transition:none !important;
}

}
      `}</style>

            <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 xl:px-16">
                <div className="hs-top">
                    <div className="hs-eyebrow">IMPACT</div>

                    <div className="hs-headline-wrap">
                        <div className="hs-tag"><span>Why</span>  Work With Me </div>
                        <h2 className="hs-headline">
                            I build scalable web applications with{" "}
                            <img src={IMG_ONE} alt="Full Stack Development" className="hs-inline-img" />
                            modern technologies, seamless user experiences{" "}
                            <img src={IMG_TWO} alt="Artificial Intelligence" className="hs-inline-img" />
                            and AI-powered solutions that solve real business <span className="content-span" >problems.</span>
                        </h2>
                    </div>

                    <div className="hs-accent">
                        <span className="hs-dot" />
                        <svg className="hs-asterisk" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M12 2V22M4.5 6L19.5 18M19.5 6L4.5 18"
                                stroke="currentColor"
                                strokeWidth="2.4"
                                strokeLinecap="round"
                            />
                        </svg>
                    </div>
                </div>

                <div className="hs-stats-row">
                    {STATS.map((stat, i) => (
                        <StatBlock key={stat.label} stat={stat} index={i} active={active} />
                    ))}
                </div>
            </div>
        </section>
    );
}
