"use client";

import { useEffect, useState } from "react";
import { useTimeline } from "@/hooks/useTimeline";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragEndEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  defaultAnimateLayoutChanges,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

// sortable card (list)
function SortableTimelineCard({
  item,
  onEdit,
  onDelete,
}: {
  item: any;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item._id,
    animateLayoutChanges: (args) =>
      defaultAnimateLayoutChanges({ ...args, wasDragging: true }),
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? "transform 250ms cubic-bezier(0.22,1,0.36,1)",
    opacity: isDragging ? 0 : 1, // blank space while dragging
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative group border rounded-xl p-4 bg-gray-50 hover:bg-white hover:shadow-md transition cursor-grab active:cursor-grabbing"
    >
      <TimelineCardContent
        item={item}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}

// Static card overlay
function TimelineCardContent({
  item,
  onEdit,
  onDelete,
}: {
  item: any;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}) {
  return (
    <>
      <div className="flex justify-between mb-2">
        <span className="px-3 py-1 mb-2 rounded-full text-md font-semibold bg-gradient-to-r from-[#04728F] to-[#04728f82] text-white">
          {item.category}
        </span>

        <span className="text-xs text-gray-400">
          {new Date(item.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* CONTENT */}
      <div
        className="tiptap-editor"
        dangerouslySetInnerHTML={{ __html: item.content }}
      />

      {/* ACTIONS */}
      {onEdit && onDelete && (
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition flex gap-2">
          <button
            className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center"
            onClick={() => onEdit(item._id)}
          >
            <FaEdit size={14} />
          </button>

          <button
            className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center"
            onClick={() => onDelete(item._id)}
          >
            <FaTrash size={14} />
          </button>
        </div>
      )}
    </>
  );
}

// Main
export default function TimelinePreview() {
  const {
    list,
    getAllTimelines,
    deleteTimelineById,
    setActiveTimeline,
    reorderTimeline,
  } = useTimeline();

  const [activeItem, setActiveItem] = useState<any>(null);

  useEffect(() => {
    getAllTimelines();
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 8,
      },
    })
  );

  const handleDelete = (id: string) => {
    toast(
      ({ closeToast }) => (
        <div className="space-y-3">
          <p className="text-sm font-medium">
            Are you sure you want to delete this timeline?
          </p>

          <div className="flex justify-end gap-2">
            <button onClick={closeToast} className="px-3 py-1 border rounded">
              Cancel
            </button>

            <button
              onClick={async () => {
                await deleteTimelineById(id);
                closeToast();
              }}
              className="px-3 py-1 bg-red-600 text-white rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { autoClose: false, closeOnClick: false, closeButton: false }
    );
  };

  const handleDragStart = (event: any) => {
    setActiveItem(list.find((i) => i._id === event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveItem(null);

    if (over && active.id !== over.id) {
      reorderTimeline(active.id.toString(), over.id.toString());
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-5 flex flex-col h-[520px]">
      <h2 className="font-semibold text-gray-800 text-lg mb-3">
        Timeline Preview
      </h2>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={list.map((i) => i._id)}
          strategy={verticalListSortingStrategy}
        >
          <div
            className="timeline-scroll flex-1 overflow-y-auto space-y-4 pr-1"
            onWheel={(e) => e.stopPropagation()}
          >
            {list.map((item) => (
              <SortableTimelineCard
                key={item._id}
                item={item}
                onEdit={(id) => setActiveTimeline(id)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>

        {/* DRAG OVERLAY (NO SORTABLE HERE) */}
        <DragOverlay>
          {activeItem ? (
            <div className="relative border rounded-xl p-4 bg-white shadow-2xl scale-[1.02]">
              <TimelineCardContent item={activeItem} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
