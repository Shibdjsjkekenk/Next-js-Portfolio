declare module "react-vertical-timeline-component" {
  import * as React from "react";

  export const VerticalTimeline: React.FC<{
    children?: React.ReactNode;
    lineColor?: string;
    animate?: boolean;
    className?: string;
  }>;

  export const VerticalTimelineElement: React.FC<{
    children?: React.ReactNode;
    className?: string;
    contentStyle?: React.CSSProperties;
    contentArrowStyle?: React.CSSProperties;
    date?: React.ReactNode;
    iconStyle?: React.CSSProperties;
    icon?: React.ReactNode;
    position?: "left" | "right";
  }>;
}
