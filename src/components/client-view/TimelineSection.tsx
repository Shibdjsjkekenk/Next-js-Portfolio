"use client";

import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";

import {
  FaGraduationCap,
  FaCertificate,
  FaTools,
  FaPaintBrush,
  FaStream,
  FaBriefcase,
  FaRocket,
  FaCode,
} from "react-icons/fa";

type Timeline = {
  _id: string;
  category: string;
  content: string;
};

const iconMap: Record<string, React.ReactNode> = {
  education: <FaGraduationCap />,
  certification: <FaCertificate />,
  certificate: <FaCertificate />,
  activity: <FaTools />,
  extraactivities: <FaTools />,
  hobby: <FaPaintBrush />,
  hobbies: <FaPaintBrush />,
  work: <FaBriefcase />,
  experience: <FaBriefcase />,
  project: <FaCode />,
  projects: <FaCode />,
  deployment: <FaRocket />,
};

const colorMap: Record<string, string> = {
  education: "#3b82f6",
  certification: "#10b981",
  certificate: "#10b981",
  activity: "#f97316",
  extraactivities: "#f97316",
  hobby: "#ef4444",
  hobbies: "#ef4444",
  work: "#6366f1",
  experience: "#6366f1",
  project: "#0ea5e9",
  projects: "#0ea5e9",
  deployment: "#a855f7",
};

const normalize = (v: string) =>
  v.toLowerCase().replace(/\s+/g, "");

export default function TimelineSection({
  list,
}: {
  list: Timeline[];
}) {
  return (
    <section className="">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-10 xl:px-16">
        <VerticalTimeline lineColor="#d1d5db">
          {list.map((item) => {
            const key = normalize(item.category);
            const icon = iconMap[key] ?? <FaStream />;
            const bg = colorMap[key] ?? "#6A38C2";

            return (
              <VerticalTimelineElement
                key={item._id}
                icon={icon}
                iconStyle={{
                  background: bg,
                  color: "#fff",
                  boxShadow: "0 0 0 4px #fff",
                }}
                /*  ONLY CHANGE IS HERE */
                date={
                  <div className="category-top">
                    <span className="text-xl font-bold text-black">
                      {item.category}
                    </span>
                  </div>
                }
                contentStyle={{
                  background: "#F3F4F6",
                  borderRadius: "12px",
                  padding: "20px 20px",
                }}
                contentArrowStyle={{
                  borderRight: "7px solid #F3F4F6",
                }}
              >
                <div
                  className="tiptap-editor"
                  dangerouslySetInnerHTML={{ __html: item.content }}
                />
              </VerticalTimelineElement>
            );
          })}
        </VerticalTimeline>
      </div>
    </section>
  );
}
