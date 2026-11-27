"use client";

import { FaSearch } from "react-icons/fa";

interface Props {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    className?: string;
}

export default function SearchInput({
    value,
    onChange,
    placeholder = "Search...",
    className = "",
}: Props) {
    return (
        <div className={`relative ${className}`}>
            {/* LEFT ICON */}
            <div
                className="
        absolute left-2 top-1/2 -translate-y-1/2
        h-8 w-8 flex items-center justify-center
        rounded-full
        bg-gradient-to-r from-[#6A38C2] to-[#8b5cf6]
        text-white shadow-md
        pointer-events-none
      "
            >
                <FaSearch size={12} />
            </div>

            {/* INPUT */}
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="
          w-[220px] sm:w-[280px] lg:w-[320px]
          h-10 pl-12 pr-10
          rounded-full
          border border-gray-200
          bg-gray-50
          text-sm
          shadow-inner
          focus:outline-none
          focus:ring-2 focus:ring-[#6A38C2]
          focus:bg-white
          transition-all
        "
            />

            {/* CLEAR BTN */}
            {value && (
                <button
                    onClick={() => onChange("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                >
                    ✕
                </button>
            )}
        </div>
    );
}