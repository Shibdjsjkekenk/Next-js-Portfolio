"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { FiArrowUpRight } from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  list: any[];
};

const responsive = {
  mobile: {
    breakpoint: { max: 767, min: 0 },
    items: 1,
  },
};

const ProjectsSlider = ({ list }: Props) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  /* DESKTOP GSAP */
  useEffect(() => {
    if (!list.length) return;
    if (window.innerWidth < 768) return;

    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const totalWidth = track.scrollWidth;
    const containerWidth = section.offsetWidth;
    const scrollDistance = totalWidth - containerWidth;

    if (scrollDistance <= 0) return;

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: -scrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${scrollDistance}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, [list]);

  return (
    <>
      {/* MOBILE CAROUSEL */}
      <div className="block md:hidden px-4">
        <Carousel
          responsive={responsive}
          infinite
          autoPlay
          autoPlaySpeed={2500}
          arrows={false}
          showDots
          containerClass="pb-8"
        >
          {list.map((project) => (
            <div
              key={project._id}
              className="bg-white shadow-md rounded-xl overflow-hidden"
            >
              <img
                src={project.projectImage}
                alt="Project"
                className="w-full h-44 object-cover"
              />

              <div className="p-4">
                <div
                  className="tiptap-editor text-sm text-gray-700 mb-4 text-justify"
                  dangerouslySetInnerHTML={{ __html: project.content }}
                />

                <a
                  href={project.projectLink}
                  target="_blank"
                  className="inline-flex items-center gap-2 text-[#6A38C2] font-medium"
                >
                  View Project <FiArrowUpRight size={14} />
                </a>
              </div>
            </div>
          ))}
        </Carousel>
      </div>

      {/* DESKTOP GSAP */}
      <section
        ref={sectionRef}
        className="hidden md:block relative w-full overflow-hidden"
      >
        <div className="h-screen flex items-center">
          <div
            ref={trackRef}
            className="flex gap-6 px-10 will-change-transform"
          >
            {list.map((project) => (
              <div
                key={project._id}
                className="min-w-[320px] max-w-[320px]
                           bg-white shadow-md rounded-xl
                           overflow-hidden flex flex-col"
              >
                <img
                  src={project.projectImage}
                  alt="Project"
                  className="w-full h-40 object-cover"
                />

                <div className="p-4 flex flex-col justify-between flex-1">
                  <div
                    className="tiptap-editor text-justify"
                    dangerouslySetInnerHTML={{ __html: project.content }}
                  />

                  <a
                    href={project.projectLink}
                    target="_blank"
                    className="inline-flex items-center gap-2
                               text-[#6A38C2] font-medium hover:underline"
                  >
                    View Project <FiArrowUpRight size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ProjectsSlider;
