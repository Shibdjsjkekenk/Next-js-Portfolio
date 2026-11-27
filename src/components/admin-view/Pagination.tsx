"use client";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-end items-center gap-2 mt-4">

      {/* PREV */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-2 py-1 rounded-md border bg-white
                   disabled:opacity-55 disabled:cursor-not-allowed"
      >
        Prev
      </button>

      {/* PAGE NUMBERS */}
      {[...Array(totalPages)].map((_, i) => {
        const page = i + 1;
        const isActive = currentPage === page;

        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded-md border font-medium transition
              ${
                isActive
                  ? "bg-[#6A38C2] text-white border-[#6A38C2]"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400"
              }`}
          >
            {page}
          </button>
        );
      })}

      {/* NEXT */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-2 py-1 rounded-md border bg-white
                   disabled:opacity-55 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}
