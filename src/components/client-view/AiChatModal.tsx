"use client";

import { Bot, X, Send, Mic } from "lucide-react";
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

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function AiChatModal({ open, onClose }: Props) {
  const greeting = getGreeting();

  const introMessage = `${greeting} 👋  

Welcome! I'm your AI portfolio assistant. You can type or use voice 🎤

I can help you explore:
• Projects & case studies  
• Skills & tech stack  
• Experience & background  
• Tools and technologies  

Feel free to ask anything — I'm here to help `;

  const [messages, setMessages] = useState<Msg[]>([
    { role: "ai", text: introMessage },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [introRemoved, setIntroRemoved] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  // scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // lock scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  // 🔊 SPEAK FUNCTION (only used in voice mode)
  const speak = (text: string) => {
    speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-IN";
    speechSynthesis.speak(utter);
  };

  // =============================
  // NORMAL TEXT MESSAGE (NO VOICE)
  // =============================
  const sendMessage = async (textOverride?: string, isVoice = false) => {
    const userText = textOverride || input;
    if (!userText.trim() || loading) return;

    setInput("");

    setMessages((prev) => {
      let updated = [...prev];

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

      // 🔊 ONLY speak if voice mode
      if (isVoice) speak(data.answer);

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

  // =============================
  // 🎤 VOICE INPUT
  // =============================
  const startVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";

    recognition.onresult = (e: any) => {
      const text = e.results[0][0].transcript;

      // Voice question spoken by user (optional)
      speak(text);

      // Send with voice mode ON
      sendMessage(text, true);
    };

    recognition.start();
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
          {/* HEADER */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 text-white">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur rounded-lg p-1.5">
                <Bot size={16} />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold">T'AI Assistant</div>
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

          {/* BODY */}
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
              {/* 🎤 MIC BUTTON */}
              <button onClick={startVoice}>
                <Mic size={16} />
              </button>

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about projects, skills..."
                className="flex-1 bg-transparent outline-none text-sm"
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />

              <button
                onClick={() => sendMessage()}
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
