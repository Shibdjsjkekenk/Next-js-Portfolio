"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import { getDB } from "@/lib/indexeddb";

/* ====================== */

type About = {
  image?: string;
  content?: string;
  resume?: string;
};

/* ====================== */

function SortableItem({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { setNodeRef, transform, transition, attributes, listeners } =
    useSortable({
      id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing"
    >
      {children}
    </div>
  );
}

/* ====================== */

export default function AboutSection({
  about,
}: {
  about: About | null;
}) {
  const [offlineAbout, setOfflineAbout] =
    useState<About | null>(about);

  const [order, setOrder] = useState<string[]>([
    "content",
    "image",
  ]);

  useEffect(() => {
    const saveAbout = async () => {
      if (!about) return;

      const db = await getDB();

      if (!db) return;

      await db.put("about", about, "about-data");
    };

    saveAbout();
  }, [about]);

  useEffect(() => {
    const loadAbout = async () => {
      if (navigator.onLine) return;

      const db = await getDB();

      if (!db) return;

      const cached = await db.get(
        "about",
        "about-data"
      );

      if (cached) {
        setOfflineAbout(cached);
      }
    };

    loadAbout();
  }, []);

  if (!offlineAbout) return null;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = (
    event: DragEndEvent
  ) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setOrder((items) => {
      const oldIndex = items.indexOf(
        active.id as string
      );

      const newIndex = items.indexOf(
        over.id as string
      );

      const updated = [...items];

      updated.splice(oldIndex, 1);

      updated.splice(
        newIndex,
        0,
        active.id as string
      );

      return updated;
    });
  };

  return (
    <section
      id="about-us"
      className="relative overflow-hidden  py-10"
    >

      {/* ================= Container ================= */}

      <div className="relative max-w-7xl mx-auto px-4 md:px-10 lg:px-14">

        {/* Top */}

        <div className="text-right">

          <span
            className="
            uppercase
            tracking-[6px]
            text-neutral-500
            text-sm
            font-semibold
          "
          >
            [ ABOUT US ]
          </span>

          <h2
            className="
    mt-5
    text-[31px]
    tracking-[-1px]
    leading-none
    sm:text-7xl
    sm:tracking-[-4px]
    lg:text-[95px]
    xl:text-[100px]
    font-black
    text-black
  "
          >
            Building Smart Digital
            <br />

           <span
  className="
    text-lime-300
    [-webkit-text-stroke:0.5px_#514c4b]
    lg:[-webkit-text-stroke:0.5px_#514c4b]
  "
>
  Experiences.
</span>
          </h2>

        </div>

        {/* ================= DND ================= */}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >

          <SortableContext
            items={order}
            strategy={
              horizontalListSortingStrategy
            }
          >

            <div
              className="
    mt-7
    grid
    lg:grid-cols-[1.7fr_0.7fr]
    gap-15
    items-start
  "
            >
              {order.map((item) =>
                item === "content" ? (
                  <SortableItem key="content" id="content">
                    <div className="relative">

                      {/* Vertical Line */}

                      <div className="absolute top-0 h-full w-px bg-white/10" />

                      <div className="">

                       <span
                            className="
            uppercase
            tracking-[6px]
            text-neutral-500
            text-sm
            font-semibold
          "
                          >
                            [ WHO I AM ]
                          </span>

                        <div
                          className="
              tiptap-editor
              mt-4
            "
                          dangerouslySetInnerHTML={{
                            __html: offlineAbout.content || "",
                          }}
                        />

                        <div className="mt-5 flex items-center gap-5">

                          <div className="h-px flex-1" />

                          <span
                            className="
            uppercase
            tracking-[6px]
            text-neutral-500
            text-sm
            font-semibold
          "
                          >
                            [ CREATIVE DEVELOPER ]
                          </span>

                        </div>

                      </div>

                    </div>
                  </SortableItem>
                ) : (
                  <SortableItem key="image" id="image">
                    <div className="flex justify-center lg:justify-end">
                      <div className="relative">
                        {/* Image Card */}

                        {offlineAbout.image && (
                          <img
                            src={offlineAbout.image}
                            alt="About"
                            className="w-[550px] object-contain"
                          />
                        )}

                        {/* Resume */}

                        {offlineAbout.resume && (

                          <a
                            href={offlineAbout.resume}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="
                mt-8
                group
                flex
                items-center
                justify-between
                rounded-full
                border
                border-white/10
                bg-[#ED6E54]
                backdrop-blur-xl
                px-6
                py-3
                text-white
                transition-all
                duration-300
                hover:border-lime-300
                hover:bg-lime-300
                hover:text-black
                shadow-[0px_4px_8px_rgba(0,0,0,0.3),inset_0px_-2px_4px_rgba(255,255,255,0.3)] hover:shadow-[0px_6px_12px_rgba(0,0,0,0.4),inset_0px_-4px_6px_rgba(255,255,255,0.4)]
              "
                          >

                            <div>

                              <p className="text-xs uppercase tracking-[3px] opacity-60">
                                Resume
                              </p>

                              <p className="font-semibold text-[22px]">
                                Download CV
                              </p>

                            </div>

                            <div
                              className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-full
                  bg-lime-300
                  text-black
                  transition-all
                  duration-300
                  group-hover:rotate-45
                "
                            >
                              <FaArrowUpRightFromSquare />
                            </div>

                          </a>

                        )}

                      </div>

                    </div>

                  </SortableItem>
                )
              )}

            </div>

          </SortableContext>

        </DndContext>

      </div>

    </section>
  );

}