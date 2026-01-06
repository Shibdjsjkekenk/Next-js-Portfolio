"use client";

type TableProps = {
  headers: string[];
  children: React.ReactNode;
};

export default function Table({ headers, children }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">

        {/* TABLE HEADER */}
        <thead className="bg-[#6A38C2] text-white">
          <tr>
            {headers.map((head, index) => (
              <th
                key={index}
                className="p-2 border text-left whitespace-nowrap"
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>

        {/* TABLE BODY */}
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
