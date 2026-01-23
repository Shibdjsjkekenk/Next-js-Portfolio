"use client";

import React, { useState } from "react";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";

/* DND */
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

/* ================= TYPES ================= */
type About = {
  image?: string;
  content?: string;
  resume?: string;
};

/* ================= SORTABLE WRAPPER ================= */
function SortableItem({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { setNodeRef, transform, transition, attributes, listeners } =
    useSortable({ id });

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

/* ================= MAIN ================= */
export default function AboutSection({ about }: { about: About | null }) {
  if (!about) return null;

  /* ORDER STATE (image <-> content) */
  const [order, setOrder] = useState<string[]>(["image", "content"]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  );

  /* DRAG END */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setOrder((items) => {
      const oldIndex = items.indexOf(active.id as string);
      const newIndex = items.indexOf(over.id as string);

      const updated = [...items];
      updated.splice(oldIndex, 1);
      updated.splice(newIndex, 0, active.id as string);
      return updated;
    });
  };

  return (
    <section className="py-16 bg-white">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={order}
          strategy={horizontalListSortingStrategy}
        >
          <div
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">            {order.map((item) =>
              item === "image" ? (
                <SortableItem key="image" id="image">
                  <div className="flex justify-center">
                    {about.image && (
                      <img
                        src={about.image}
                        alt="About"
                        className="w-[550px] object-contain"
                      />
                    )}
                  </div>
                </SortableItem>
              ) : (
                <SortableItem key="content" id="content">
                  <div>
                    {/* TAG */}
                    <div className="pb-4">
                      <span className="px-4 py-2  rounded-full bg-[rgba(226,229,235,0.72)] text-[#F83002] text-[16px] abt font-extrabold text-center w-[20%] hurry-up">
                        About <span className="text-[#6A38C2]">Us</span>
                      </span>
                    </div>

                    {/* CONTENT */}
                    <div
                      className="tiptap-editor"
                      dangerouslySetInnerHTML={{
                        __html: about.content || "",
                      }}
                    />

                    {/* DOWNLOAD CV */}
                    {about.resume && (
                      <div className="mt-6">
                        <a
                          href={about.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          download="resume.pdf"
                          className="
                            group inline-flex items-center gap-4
                            text-white font-semibold text-lg
                            px-6 py-2 rounded-full
                            bg-[#6A38C2]
                            shadow-[0_2px_8px_rgba(99,99,99,0.88)]
                            transition-all duration-300
                            hover:scale-105 active:scale-95
                          "
                        >
                          <span>Download CV</span>

                          <span
                            className="
                              flex items-center justify-center
                              w-9 h-9 rounded-full
                              bg-[#FF6A3D]
                              transition-transform duration-300
                              group-hover:rotate-45
                            "
                          >
                            <FaArrowUpRightFromSquare className="text-white text-sm" />
                          </span>
                        </a>
                      </div>
                    )}
                  </div>
                </SortableItem>
              )
            )}
          </div>
        </SortableContext>
      </DndContext>
    </section>
  );
}
