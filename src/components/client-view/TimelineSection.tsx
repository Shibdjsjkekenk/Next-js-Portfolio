"use client";

import {
  FaGraduationCap,
  FaCertificate,
  FaTools,
} from "react-icons/fa";

type Timeline = {
  _id: string;
  category: string;
  content: string;
};

const iconMap: Record<string, React.ReactNode> = {
  education: <FaGraduationCap />,
  certification: <FaCertificate />,
  "extra activities": <FaTools />,
};

const colorMap: Record<string, string> = {
  education: "bg-blue-500",
  certification: "bg-green-500",
  "extra activities": "bg-orange-500",
};

const normalize = (v: string) =>
  v.toLowerCase().trim();

export default function TimelineSection({ list }: { list: Timeline[] }) {
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4 relative">

        {/* CENTER LINE */}
        <div className="absolute left-1/2 top-0 h-full w-[2px] bg-gray-300 -translate-x-1/2 hidden md:block" />

        <div className="space-y-24">
          {list.map((item, index) => {
            const key = normalize(item.category);
            const icon = iconMap[key];
            const color = colorMap[key] ?? "bg-gray-500";

            const isLeftCard = index % 2 === 0;

            return (
              <div
                key={item._id}
                className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-8"
              >
                {/* LEFT SIDE */}
                <div className="flex justify-end">
                  {isLeftCard ? (
                    <div className="bg-gray-100 p-5 rounded-xl shadow max-w-md">
                      <div
                        className="tiptap-editor"
                        dangerouslySetInnerHTML={{
                          __html: item.content,
                        }}
                      />
                    </div>
                  ) : (
                    <span className="font-semibold text-gray-800">
                      {item.category}
                    </span>
                  )}
                </div>

                {/* CENTER ICON */}
                <div className="flex flex-col items-center">
                  <div
                    className={`h-12 w-12 rounded-full flex items-center justify-center text-white shadow ${color}`}
                  >
                    {icon}
                  </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="flex justify-start">
                  {!isLeftCard ? (
                    <div className="bg-gray-100 p-5 rounded-xl shadow max-w-md">
                      <div
                        className="tiptap-editor"
                        dangerouslySetInnerHTML={{
                          __html: item.content,
                        }}
                      />
                    </div>
                  ) : (
                    <span className="font-semibold text-gray-800">
                      {item.category}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
