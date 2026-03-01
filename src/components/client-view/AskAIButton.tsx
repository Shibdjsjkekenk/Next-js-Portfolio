"use client";

import { useState } from "react";
import { Bot } from "lucide-react";
import AiChatModal from "@/components/client-view/AiChatModal";
import { Sparkles } from "lucide-react";

export default function AskAIButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center">
        {/* LABEL WITH ARROW */}
        <div className="mb-2 animate-bounce flex flex-col items-center">
          {/* Tooltip */}
          <div
            className="
            relative px-3 py-1.5 rounded-full
            bg-gray-900 text-white text-xs font-semibold
            shadow-lg
          "
          >
            Ask with T'AI
            {/* Arrow */}
            <span
              className="
              absolute left-1/2 -bottom-1.5
              -translate-x-1/2
              w-3 h-3 bg-gray-900
              rotate-45
            "
            />
          </div>
        </div>

        {/* CIRCLE BUTTON */}
        <button
          onClick={() => setOpen(true)}
          className="
            group relative
            h-14 w-14 rounded-full
            bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500
            text-white
            flex items-center justify-center
            shadow-xl
            hover:scale-110 active:scale-95
            transition-all duration-300
          "
        >
          {/* Glow */}
          <span className="absolute inset-0 rounded-full bg-purple-500 blur-xl opacity-30 group-hover:opacity-60 transition" />

          <Sparkles size={22} className="relative z-10 animate-spin-slow" />
        </button>
      </div>

      <AiChatModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
