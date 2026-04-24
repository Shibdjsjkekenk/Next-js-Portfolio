"use client";

import { ExternalLink } from "lucide-react";

export default function AIProjectCards({ cards }: any) {
  if (!cards?.length) return null;

  return (
    <div className="flex flex-col gap-4 mt-3">
      {cards.map((card: any, i: number) => (
        <div
          key={i}
          className="w-full bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden border border-gray-100"
        >
          {/* IMAGE */}
          <div className="relative h-44 w-full overflow-hidden">
            <img
              src={card.image}
              alt={card.title}
              className="w-full h-full object-cover transition duration-500 hover:scale-105"
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-3">
              <h3 className="text-white text-sm font-semibold leading-tight break-words line-clamp-2">
                {card.title}
              </h3>
            </div>
          </div>

          {/* CONTENT */}
          <div className="p-4 flex flex-col gap-3">
            {/* DESCRIPTION */}
            {card.description && (
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                {card.description}
              </p>
            )}

            {/* BUTTON */}
            <a
              href={card.link}
              target="_blank"
              className="mt-auto flex items-center justify-center gap-2 w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white text-sm font-medium py-2.5 rounded-xl shadow hover:opacity-90 transition"
            >
              View Project
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}