"use client";

import { FaStream } from "react-icons/fa";
import TimelineCreate from "@/components/admin-view/TimelineCreate";
import TimelinePreview from "@/components/admin-view/TimelinePreview";

export default function TimelinePage() {

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="bg-white rounded-xl py-3 px-5 shadow flex items-center">
        <h1 className="flex items-center gap-2 font-bold text-gray-800 text-base sm:text-2xl">
          <FaStream className="text-[#6A38C2]" />
          Timeline
          <span className="text-xs sm:text-sm text-gray-500">
            ( Manage timeline sections )
          </span>
        </h1>
      </div>

      {/* 2 COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TimelineCreate/>
        <TimelinePreview />
      </div>
    </div>
  );
}
