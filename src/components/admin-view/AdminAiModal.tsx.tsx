"use client";

import { X, Sparkles, Send } from "lucide-react";
import { useState } from "react";

export default function AdminAiModal({ open, onClose }: any) {
  const [command, setCommand] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const runAI = async (customCommand?: string) => {
    const finalCommand = customCommand || command;
    if (!finalCommand) return;

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        body: JSON.stringify({ question: finalCommand }),
      });

      const data = await res.json();
      setResponse(data.answer);
    } catch (err) {
      setResponse("Error executing AI command");
    }

    setLoading(false);
    setCommand("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-5 space-y-4">

        {/* HEADER */}
        <div className="flex justify-between items-center border-b pb-2">
          <div className="flex items-center gap-2 font-semibold text-gray-800">
            <Sparkles size={18} />
            Admin AI Control
          </div>

          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() =>
              runAI("Create timeline Experience | 2 years MERN stack")
            }
            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 p-2 rounded-lg text-sm"
          >
            ➕ Add Timeline
          </button>

          <button
            onClick={() =>
              runAI("Update timeline Experience | 3 years full stack")
            }
            className="bg-yellow-50 hover:bg-yellow-100 text-yellow-700 p-2 rounded-lg text-sm"
          >
            ✏️ Update Timeline
          </button>

          <button
            onClick={() => runAI("Delete timeline education")}
            className="bg-red-50 hover:bg-red-100 text-red-700 p-2 rounded-lg text-sm"
          >
            🗑 Delete Timeline
          </button>

          <button
            onClick={() => runAI("Show my timeline")}
            className="bg-green-50 hover:bg-green-100 text-green-700 p-2 rounded-lg text-sm"
          >
            📄 View Timeline
          </button>
        </div>

        {/* INPUT */}
        <div className="flex gap-2">
          <input
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Type custom command..."
            className="flex-1 border rounded-lg px-3 py-2 text-sm"
          />

          <button
            onClick={() => runAI()}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 rounded-lg flex items-center gap-1"
          >
            <Send size={16} />
          </button>
        </div>

        {/* RESPONSE */}
        <div className="bg-gray-50 rounded-lg p-3 min-h-[80px] text-sm text-gray-700">
          {loading ? "Processing..." : response || "AI response will appear here"}
        </div>
      </div>
    </div>
  );
}