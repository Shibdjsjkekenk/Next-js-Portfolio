"use client";

import { Bot, X, Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import AIProjectCards from "@/components/client-view/AIProjectCards";

interface Props {
  open: boolean;
  onClose: () => void;
}

interface Card {
  title: string;
  image: string;
  link: string;
}

interface Msg {
  role: "user" | "ai";
  text: string;
  cards?: Card[];
}

// Professional Greeting
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function AiChatModal({ open, onClose }: Props) {
  const greeting = getGreeting();

  const introMessage = `${greeting} 👋  

Welcome! I'm your AI portfolio assistant.

I can help you explore:
• Projects & case studies  
• Skills & tech stack  
• Experience & background  
• Tools and technologies  

Feel free to ask anything — I'm here to help 🚀`;

  const [messages, setMessages] = useState<Msg[]>([
    { role: "ai", text: introMessage },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [introRemoved, setIntroRemoved] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userText = input;
    setInput("");

    setMessages((prev) => {
      let updated = [...prev];

      // Remove intro after first user message
      if (!introRemoved) {
        updated = updated.filter((m) => m.text !== introMessage);
        setIntroRemoved(true);
      }

      return [...updated, { role: "user", text: userText }];
    });

    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ question: userText }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: data.answer,
          cards: data.projectCards || [],
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "⚠️ Something went wrong." },
      ]);
    }

    setLoading(false);
  };

  if (!open) return null;

  return (
    <>
      {/* MOBILE BACKDROP */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
        onClick={onClose}
      />

      {/* CHAT BOX */}
      <div className="fixed z-50 bottom-20 right-4 w-[360px] max-w-[95vw] md:bottom-24 md:right-5 max-md:left-3 max-md:right-3 max-md:w-auto">
        <div className="bg-white rounded-2xl shadow-2xl border overflow-hidden flex flex-col">
          {/* PREMIUM HEADER */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 text-white">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur rounded-lg p-1.5">
                <Bot size={16} />
              </div>

              <div className="leading-tight">
                <div className="text-sm font-semibold">AI Assistant</div>
                <div className="text-[10px] text-white/80 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                  Online
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="
    relative
    h-8 w-8
    flex items-center justify-center
    rounded-full
    bg-white/15
    backdrop-blur-md
    border border-white/30
    shadow-sm
    hover:bg-white/25
    hover:scale-105
    transition-all duration-300
  "
            >
              <X size={14} className="text-white" />
            </button>
          </div>

          {/* CHAT BODY */}
          <div className="h-[60vh] overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div className="max-w-[85%] space-y-2">
                  <div
                    className={`px-4 py-3 rounded-xl text-sm whitespace-pre-line ${
                      m.role === "user"
                        ? "bg-indigo-600 text-white"
                        : "bg-white border"
                    }`}
                  >
                    {m.text}
                  </div>

                  {m.cards?.length ? <AIProjectCards cards={m.cards} /> : null}
                </div>
              </div>
            ))}

            {loading && (
              <div className="text-xs text-gray-400 animate-pulse">
                AI is typing...
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* INPUT */}
          <div className="p-3 border-t bg-white">
            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about projects, skills..."
                className="flex-1 bg-transparent outline-none text-sm"
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />

              <button
                onClick={sendMessage}
                className="bg-indigo-600 text-white p-2 rounded-full hover:scale-105 transition"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
