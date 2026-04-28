"use client";

import { ExternalLink } from "lucide-react";
import { useState } from "react";


export default function AIProjectCards({ cards }: any) {
  if (!cards?.length) return null;

  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-4 mt-3">
      {cards.map((card: any, i: number) => (
        <div
          key={i}
          className="w-full max-w-[320px] bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden border border-gray-100"
        >
          {/* IMAGE */}
          <div className="relative aspect-[21/10] w-full overflow-hidden rounded-t-2xl">
            <img
              src={card.image || "/placeholder.png"}
              onError={(e) => (e.currentTarget.src = "/placeholder.png")}
              alt={card.title}
              className="w-full h-full object-cover"
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-3">
              <h3 className="text-white text-[12px] font-semibold leading-tight break-words line-clamp-2">
                {card.title}
              </h3>
            </div>
          </div>

          {/* CONTENT */}
          <div className="p-4 flex flex-col gap-3 h-[140px]">
            {/* DESCRIPTION */}
            {card.description && (
              <div
                className={`text-gray-600 text-sm leading-relaxed ${expanded === i
                    ? "max-h-[80px] overflow-y-auto pr-1 scrollbar-thin-custom"
                    : ""
                  }`}
              >
                <p className={expanded === i ? "" : "line-clamp-2"}>
                  {card.description}
                </p>

                <button
                  onClick={() =>
                    setExpanded(expanded === i ? null : i)
                  }
                  className="text-purple-600 text-xs font-medium mt-1 hover:underline"
                >
                  {expanded === i ? "Show Less" : "Read More"}
                </button>
              </div>
            )}

            {/* BUTTON */}
            <div className="mt-auto flex items-center justify-between gap-2">

              {/* STATUS */}
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${card.isActive
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-500"
                  }`}
              >
                {card.isActive ? "Active" : "Inactive"}
              </span>

              {/* VIEW BUTTON */}
              <a
                href={card.link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs px-4 py-1.5 rounded-lg shadow hover:opacity-90 transition"
              >
                View
                <ExternalLink size={14} />
              </a>

            </div>
          </div>
        </div>
      ))}
    </div>
  );
}