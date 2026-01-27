"use client";

import { useEffect, useState } from "react";

type Props = {
  html: string;
  className?: string;
};

export default function ClientHTML({ html, className = "" }: Props) {
  const [content, setContent] = useState("");

  useEffect(() => {
    setContent(html || "");
  }, [html]);

  if (!content) return null;

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
