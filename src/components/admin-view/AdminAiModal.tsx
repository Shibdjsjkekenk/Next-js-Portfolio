"use client";

import {
  X,
  Sparkles,
  Send,
  Users,
  Image,
  Info,
  Clock,
  Folder,
  Phone,
  RotateCcw,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function AdminAiModal({ open, onClose }: any) {
  const [command, setCommand] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!open) return null;

  const modules = [
    { name: "All Users", icon: <Users size={18} />, command: "Fetch and show all users with details in list format", color: "text-indigo-500", bg: "bg-indigo-50" },
    { name: "Banner", icon: <Image size={18} />, command: "Show current banner data and ask what to update", color: "text-violet-500", bg: "bg-violet-50" },
    { name: "About Us", icon: <Info size={18} />, command: "Fetch complete About Us content and display it. Then ask what needs to be updated", color: "text-purple-500", bg: "bg-purple-50" },
    { name: "Timeline", icon: <Clock size={18} />, command: "Fetch full timeline data and show all entries clearly", color: "text-fuchsia-500", bg: "bg-fuchsia-50" },
    { name: "Projects", icon: <Folder size={18} />, command: "Fetch all projects with title, description and status", color: "text-pink-500", bg: "bg-pink-50" },
    { name: "Contact Data", icon: <Phone size={18} />, command: "Fetch all contact details and display them properly", color: "text-indigo-500", bg: "bg-indigo-50" },
  ];

  const runAI = async (customCommand?: string, moduleName?: string) => {
    const finalCommand = customCommand || command;
    if (!finalCommand) return;

    setMessages((prev) => [...prev, { type: "user", text: finalCommand }]);
    setLoading(true);
    setCommand("");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        body: JSON.stringify({ question: finalCommand, module: moduleName || activeModule }),
      });
      const data = await res.json();
      const clean = data.answer.replace("Final Answer:", "").trim();
      setMessages((prev) => [...prev, { type: "ai", text: clean }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { type: "ai", text: "Something went wrong. Please try again." },
      ]);
    }

    setLoading(false);
  };

  const handleReset = () => {
    setMessages([]);
    setActiveModule(null);
    setCommand("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(15,10,40,0.50)] backdrop-blur-xl">

      {/* MODAL */}
      <div className="relative w-full max-w-5xl h-[88vh] flex flex-col overflow-hidden rounded-3xl  shadow-[0_24px_80px_rgba(30,10,80,0.28)] bg-gradient-to-br from-[#f5f3ff] via-white to-[#fdf4ff]">

        {/* ── HEADER ── */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-indigo-500 via-purple-500 via-fuchsia-500 to-pink-500 flex-shrink-0">

          {/* Left */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center flex-shrink-0">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-[15px] leading-tight">AI Assistant</p>
              <p className="text-white/70 text-[11px]">Admin Control Panel</p>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button
                onClick={handleReset}
                title="New session"
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur border border-white/25 text-white/90 flex items-center justify-center transition-all hover:scale-105"
              >
                <RotateCcw size={14} />
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/28 backdrop-blur border border-white/28 text-white/90 flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.25)] transition-all hover:scale-105"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-transparent">

          {/* EMPTY STATE */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">

              {/* Orb */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-[0_8px_32px_rgba(99,102,241,0.35)] mb-5">
                <Sparkles size={26} className="text-white" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-[#0f0a28] tracking-tight leading-snug mb-2">
                Control your system with AI Agent
              </h2>
              <p className="text-gray-400 text-sm mb-8 max-w-sm">
                Select a module below or type any command to get started
              </p>

              {/* MODULE GRID */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full max-w-2xl">
                {modules.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setActiveModule(item.name);
                      runAI(item.command, item.name);
                    }}
                    className="flex items-center gap-3 bg-white border border-black/[0.07] rounded-2xl p-4 cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(99,60,180,0.12)] hover:border-indigo-200 transition-all duration-200"
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${item.bg} ${item.color}`}>
                      {item.icon}
                    </div>
                    <div className="text-left min-w-0">
                      <p className="text-[13px] font-semibold text-indigo-950 truncate">{item.name}</p>
                      <p className="text-[11px] text-gray-400">Manage via AI</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CHAT MESSAGES */}
          {messages.length > 0 && (
            <div className="flex flex-col gap-3">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-end gap-2 ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  {/* AI avatar */}
                  {msg.type === "ai" && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-[0_2px_6px_rgba(99,102,241,0.3)] mb-0.5">
                      <Sparkles size={12} className="text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-[72%] px-4 py-2.5 text-[13.5px] leading-relaxed whitespace-pre-wrap ${msg.type === "user"
                      ? "bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 text-white rounded-[18px_18px_4px_18px] shadow-[0_2px_10px_rgba(99,102,241,0.25)]"
                      : "bg-white text-indigo-950 border border-black/[0.07] rounded-[18px_18px_18px_4px] shadow-sm"
                      }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className="flex items-end gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-[0_2px_6px_rgba(99,102,241,0.3)]">
                    <Sparkles size={12} className="text-white" />
                  </div>
                  <div className="bg-white border border-black/[0.07] rounded-[18px_18px_18px_4px] px-4 py-3 shadow-sm flex gap-1.5 items-center">
                    {[0, 200, 400].map((delay, i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce"
                        style={{ animationDelay: `${delay}ms` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* ── INPUT ── */}
        <div className="px-4 py-3 bg-white/70 backdrop-blur-xl border-t border-black/[0.06] flex-shrink-0">
          <div className="flex items-center gap-2.5 bg-white rounded-full px-5 py-2.5 border border-black/[0.09] focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all shadow-sm">
            <textarea
              value={command}
              onChange={(e) => {
                setCommand(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  runAI();
                }
              }}
              placeholder="Ask anything or give a command..."
              rows={1}
              className="flex-1 bg-transparent outline-none text-[13.5px] text-indigo-950 placeholder:text-gray-400 resize-none leading-relaxed break-words whitespace-pre-wrap"
            />
            <button
              onClick={() => runAI()}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 flex items-center justify-center flex-shrink-0 shadow-[0_3px_10px_rgba(99,102,241,0.4)] hover:scale-105 hover:shadow-[0_4px_16px_rgba(99,102,241,0.55)] transition-all"
            >
              <Send size={15} className="text-white ml-0.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
