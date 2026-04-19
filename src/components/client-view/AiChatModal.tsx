"use client";

import { Bot, X, Send, Mic, MoreVertical, RotateCcw } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import AIProjectCards from "@/components/client-view/AIProjectCards";
import SiriWaveChat from "@/components/client-view/SiriWaveChat";

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
  resume?: string;
  time?: string;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getTime() {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
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

  const initialMessages: Msg[] = [
    { role: "ai", text: introMessage, time: getTime() },
  ];

  const [messages, setMessages] = useState<Msg[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [introRemoved, setIntroRemoved] = useState(false);
  const [listening, setListening] = useState(false);
  const [refreshSpin, setRefreshSpin] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const speak = (text: string) => {
    speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-IN";
    speechSynthesis.speak(utter);
  };

  // ── Refresh: reset chat state, modal stays open ──
  const handleRefresh = () => {
    setRefreshSpin(true);
    setTimeout(() => setRefreshSpin(false), 600);
    speechSynthesis.cancel();
    setMessages([{ role: "ai", text: introMessage, time: getTime() }]);
    setInput("");
    setLoading(false);
    setIntroRemoved(false);
    setListening(false);
  };

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
      return [...updated, { role: "user", text: userText, time: getTime() }];
    });

    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ question: userText }),
      });

      const data = await res.json();

      if (isVoice) speak(data.answer);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: data.answer,
          cards: data.projectCards || [],
          resume: data.resume || "",
          time: getTime(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "⚠️ Something went wrong.", time: getTime() },
      ]);
    }

    setLoading(false);
  };

  const startVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice not supported in this browser");
      return;
    }

    try {
      const sound = new Audio("/sound-on-chat-ai.mp3");
      sound.volume = 0.35;
      sound.play().catch(() => {});
    } catch {}

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = true;

    setListening(true);

    recognition.onresult = (e: any) => {
      const result = e.results[0];
      const transcript = result[0].transcript;
      setInput(transcript);

      if (result.isFinal) {
        setListening(false);
        sendMessage(transcript, true);
        recognition.stop();
        setInput("");
      }
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognition.start();
  };

  if (!open) return null;

  return (
    <>
      <style>{`
        .wa-chat-bg {
          background-color: #ede9f8;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
        }
        .wa-bubble-in {
          background: #ffffff;
          border-radius: 0px 10px 10px 10px;
          box-shadow: 0 1px 2px rgba(99,60,180,0.10);
          position: relative;
        }
        .wa-bubble-in::before {
          content: '';
          position: absolute;
          top: 0; left: -8px;
          width: 0; height: 0;
          border-top: 8px solid #ffffff;
          border-left: 8px solid transparent;
        }
        .wa-bubble-out {
          background: #7c3aed;
          border-radius: 10px 0px 10px 10px;
          box-shadow: 0 2px 8px rgba(99,60,180,0.35);
          position: relative;
        }
        .wa-bubble-out::after {
          content: '';
          position: absolute;
          top: 0; right: -8px;
          width: 0; height: 0;
          border-top: 8px solid #7c3aed;
          border-right: 8px solid transparent;
        }
        .wa-tick { color: rgba(255,255,255,0.9); font-size: 11px; }
        .wa-scrollbar::-webkit-scrollbar { width: 5px; }
        .wa-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .wa-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(109,40,217,0.2);
          border-radius: 10px;
        }
        @keyframes wa-slide-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .wa-appear { animation: wa-slide-up 0.22s ease-out forwards; }
        @keyframes wa-typing-dot {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
          40%            { transform: scale(1);   opacity: 1; }
        }
        .wa-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #7c3aed;
          display: inline-block;
          animation: wa-typing-dot 1.2s infinite ease-in-out;
        }
        .wa-dot:nth-child(2) { animation-delay: 0.2s; }
        .wa-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes mic-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(139,92,246,0.55); }
          50%       { box-shadow: 0 0 0 9px rgba(139,92,246,0); }
        }
        .wa-mic-pulse { animation: mic-pulse 1s ease-in-out infinite; }
        .wa-icon-btn {
          width: 42px; height: 42px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; border: none; cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .wa-icon-btn:hover { transform: scale(1.08); }
        .wa-mic-btn {
          background: rgba(124,58,237,0.12);
          color: #7c3aed;
        }
        .wa-mic-btn.active {
          background: #7c3aed;
          color: #fff;
          box-shadow: 0 3px 10px rgba(124,58,237,0.4);
        }
        .wa-send-btn {
          background: linear-gradient(135deg, #6366f1 0%, #7c3aed 55%, #a21caf 100%);
          box-shadow: 0 3px 10px rgba(124,58,237,0.4);
        }
        .wa-send-btn:hover { box-shadow: 0 4px 16px rgba(124,58,237,0.55); }
        @keyframes spin-once {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        .spin-once { animation: spin-once 0.6s ease-out; }
      `}</style>

      {/* MOBILE BACKDROP */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40 md:hidden"
        onClick={onClose}
      />

      {/* CHAT BOX */}
      <div className="fixed z-50 bottom-20 right-4 w-[370px] max-w-[95vw] md:bottom-24 md:right-5 max-md:left-4 max-md:right-4 max-md:w-auto wa-appear">
        <div
          className="rounded-2xl overflow-hidden flex flex-col"
          style={{
            boxShadow: "0 8px 40px rgba(99,60,180,0.25), 0 2px 8px rgba(0,0,0,0.10)",
            height: "75vh",
            maxHeight: "640px",
          }}
        >
          {/* ── HEADER ── */}
          <div
            style={{
              background: "linear-gradient(90deg, #4f46e5 0%, #7c3aed 50%, #a21caf 100%)",
            }}
            className="flex items-center gap-3 px-3 py-2.5"
          >
            {/* Avatar */}
            <div
              style={{
                width: 40, height: 40, borderRadius: "50%",
                background: "rgba(255,255,255,0.18)",
                backdropFilter: "blur(8px)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, position: "relative",
                border: "1.5px solid rgba(255,255,255,0.3)",
              }}
            >
              <Bot size={20} color="#fff" />
              <span style={{
                position: "absolute", bottom: 2, right: 2,
                width: 10, height: 10, borderRadius: "50%",
                background: "#4ade80", border: "2px solid #7c3aed",
              }} />
            </div>

            {/* Name + status */}
            <div className="flex-1 min-w-0">
              <div style={{
                color: "#fff", fontWeight: 600, fontSize: 15,
                letterSpacing: 0.2, fontFamily: "'Segoe UI', sans-serif", lineHeight: 1.2,
              }}>
                T'AI Assistant
              </div>
              <div style={{
                color: "rgba(255,255,255,0.78)", fontSize: 11.5,
                fontFamily: "'Segoe UI', sans-serif",
              }}>
                {loading ? "typing..." : "online"}
              </div>
            </div>

            {/* Header icons: Refresh + More + Close */}
            <div className="flex items-center gap-3">
              {/* Refresh button */}
              <button
                onClick={handleRefresh}
                title="New chat"
                style={{ color: "rgba(255,255,255,0.90)", background: "none", border: "none", cursor: "pointer", padding: 2 }}
              >
                <RotateCcw
                  size={17}
                  className={refreshSpin ? "spin-once" : ""}
                />
              </button>

              <button style={{ color: "rgba(255,255,255,0.85)", background: "none", border: "none", cursor: "pointer" }}>
                <MoreVertical size={18} />
              </button>

              <button
                onClick={onClose}
                style={{
                  color: "rgba(255,255,255,0.92)",
                  background: "rgba(255,255,255,0.18)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.28)",
                  borderRadius: "50%",
                  width: 30, height: 30,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                  marginLeft: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.25)",
                  transition: "background 0.2s, transform 0.15s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.28)";
                  (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.18)";
                  (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                }}
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* ── DATE CHIP ── */}
          <div className="wa-chat-bg flex justify-center pt-3">
            <span style={{
              background: "rgba(237,233,248,0.95)", color: "#6d28d9",
              fontSize: 11, fontFamily: "'Segoe UI', sans-serif",
              borderRadius: 8, padding: "3px 10px",
              boxShadow: "0 1px 3px rgba(99,60,180,0.12)", fontWeight: 500,
            }}>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long", month: "long", day: "numeric",
              })}
            </span>
          </div>

          {/* ── MESSAGES BODY ── */}
          <div className="wa-chat-bg wa-scrollbar flex-1 overflow-y-auto px-3 py-2 space-y-1">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} mb-1`}
              >
                <div style={{ maxWidth: "82%" }}>
                  <div
                    className={m.role === "user" ? "wa-bubble-out" : "wa-bubble-in"}
                    style={{
                      padding: "7px 10px 5px 10px",
                      fontFamily: "'Segoe UI', sans-serif",
                      fontSize: 13.5, lineHeight: 1.5,
                    }}
                  >
                    <div style={{ whiteSpace: "pre-line", color: m.role === "user" ? "#fff" : "#1e1b4b" }}>
                      {m.text}
                    </div>
                    <div
                      className="flex items-center justify-end gap-1 mt-1"
                      style={{ fontSize: 10.5, color: m.role === "user" ? "rgba(255,255,255,0.65)" : "#9ca3af" }}
                    >
                      <span>{m.time}</span>
                      {m.role === "user" && <span className="wa-tick">✓✓</span>}
                    </div>
                  </div>

                  {m.cards?.length ? (
                    <div className="mt-1.5"><AIProjectCards cards={m.cards} /></div>
                  ) : null}

                  {m.resume && (
                    <div className="mt-2">
                      <a
                        href={m.resume}
                        download="Shubhanshu_Tiwari_CV.pdf"
                        target="_blank"
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 6,
                          background: "linear-gradient(135deg, #6366f1, #7c3aed)",
                          color: "#fff", fontSize: 12, padding: "6px 14px",
                          borderRadius: 8, textDecoration: "none",
                          fontFamily: "'Segoe UI', sans-serif", fontWeight: 600,
                          boxShadow: "0 2px 8px rgba(124,58,237,0.3)",
                        }}
                      >
                        📄 Download CV
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start mb-1">
                <div className="wa-bubble-in" style={{ padding: "10px 14px", display: "flex", gap: 4, alignItems: "center" }}>
                  <span className="wa-dot" />
                  <span className="wa-dot" />
                  <span className="wa-dot" />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* ── INPUT BAR ── mic LEFT | input CENTER | send RIGHT ── */}
          <div
            style={{ background: "#f3f0fc", padding: "8px 10px" }}
            className="flex items-center gap-2"
          >
            {/* LEFT: Mic */}
            <button
              onClick={startVoice}
              className={`wa-icon-btn wa-mic-btn ${listening ? "active wa-mic-pulse" : ""}`}
              title="Voice input"
            >
              <Mic size={18} />
            </button>

            {/* CENTER: Input pill */}
            <div
              className="flex-1 flex items-center gap-2"
              style={{
                background: "#fff", borderRadius: 24,
                padding: "8px 14px",
                boxShadow: "0 1px 3px rgba(99,60,180,0.12)",
                border: "1px solid rgba(124,58,237,0.12)",
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={listening ? "🎤 Listening..." : "Ask about projects, skills..."}
                style={{
                  flex: 1, border: "none", outline: "none",
                  background: "transparent",
                  fontFamily: "'Segoe UI', sans-serif",
                  fontSize: 13.5, color: "#1e1b4b",
                }}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              {listening && (
                <div style={{ background: "#ede9f8", borderRadius: 10, padding: 4 }}>
                  <SiriWaveChat active />
                </div>
              )}
            </div>

            {/* RIGHT: Send */}
            <button
              onClick={() => sendMessage()}
              className="wa-icon-btn wa-send-btn"
              title="Send message"
            >
              <Send size={16} color="#fff" style={{ marginLeft: 2 }} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
