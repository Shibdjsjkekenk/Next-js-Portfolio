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
} from "lucide-react";
import { useState } from "react";

export default function AdminAiModal({ open, onClose }: any) {
  const [command, setCommand] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  if (!open) return null;

  const modules = [
    {
      name: "All Users",
      icon: <Users size={20} />,
      command: "Fetch and show all users with details in list format",
    },
    {
      name: "Banner",
      icon: <Image size={20} />,
      command: "Show current banner data and ask what to update",
    },
    {
      name: "About Us",
      icon: <Info size={20} />,
      command:
        "Fetch complete About Us content and display it. Then ask what needs to be updated",
    },
    {
      name: "Timeline",
      icon: <Clock size={20} />,
      command: "Fetch full timeline data and show all entries clearly",
    },
    {
      name: "Projects",
      icon: <Folder size={20} />,
      command: "Fetch all projects with title, description and status",
    },
    {
      name: "Contact Data",
      icon: <Phone size={20} />,
      command: "Fetch all contact details and display them properly",
    },
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
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { type: "ai", text: "Something went wrong. Please try again." },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-lg p-4">

      {/* MODAL */}
      <div className="w-full max-w-[720px] sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl h-[88vh] bg-white/90 backdrop-blur-2xl rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center px-5 sm:px-6 py-4 border-b bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 text-white">

          <div className="flex items-center gap-2 font-semibold text-base sm:text-lg">
            <div className="p-2 rounded-lg bg-white/20 backdrop-blur">
              <Sparkles size={16} />
            </div>
            AI Assistant
          </div>

          <button
            onClick={onClose}
            className="bg-white/40 hover:bg-white/60 backdrop-blur-md p-2 rounded-full transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-6 bg-gradient-to-b from-gray-50/60 to-white">

          {/* EMPTY STATE */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">

              <h2 className="text-2xl sm:text-4xl font-semibold text-gray-900 mb-3 tracking-tight leading-tight">
                Control your system with AI Agent
              </h2>

              <p className="text-gray-500 text-lg mb-6 max-w-md">
                Select a module or ask anything to get started
              </p>

              {/* GRID */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 w-full max-w-2xl">

                {modules.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      const moduleName = item.name;
                      setActiveModule(moduleName);

                      runAI(item.command, moduleName);
                    }}
                    className="cursor-pointer group bg-white border rounded-xl p-4 hover:shadow-lg transition hover:-translate-y-1 hover:border-indigo-300"
                  >
                    <div className="flex items-center gap-3">

                      <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition">
                        {item.icon}
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          Manage via AI
                        </p>
                      </div>

                    </div>
                  </div>
                ))}

              </div>
            </div>
          )}

          {/* CHAT */}
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex mb-3 ${msg.type === "user" ? "justify-end" : "justify-start"
                }`}
            >
              <div
                className={`max-w-[80%] sm:max-w-[65%] px-4 py-2 rounded-2xl text-sm shadow-sm ${msg.type === "user"
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                  : "bg-white border"
                  }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="text-sm text-gray-400 animate-pulse">
              AI is thinking...
            </div>
          )}
        </div>

        {/* INPUT */}
        <div className="p-3 sm:p-4 border-t bg-white/70 backdrop-blur-xl">
          <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 border focus-within:ring-2 focus-within:ring-indigo-400">

            <input
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 bg-transparent outline-none text-sm"
            />

            <button
              onClick={() => runAI()}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-2 rounded-full hover:scale-105 transition"
            >
              <Send size={16} />
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}