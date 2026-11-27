import React from "react";

interface Props {
  active: boolean;
}

const SiriWaveChat = ({ active }: Props) => {
  return (
    <div className="flex items-center justify-center gap-[4px] h-6">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className={`w-[4px] rounded-full bg-gradient-to-t from-indigo-500 to-purple-500 ${
            active ? "animate-siri-wave" : "h-[6px]"
          }`}
          style={{
            animationDelay: `${i * 0.12}s`,
            height: active ? "100%" : "6px",
          }}
        />
      ))}
    </div>
  );
};

export default SiriWaveChat;