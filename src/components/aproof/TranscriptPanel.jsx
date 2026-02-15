import { useEffect, useRef } from "react";

export default function TranscriptPanel({ transcript = [] }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript.length]);

  if (transcript.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-muted-foreground">
        Het transcript verschijnt hier zodra het gesprek begint...
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
      {transcript.map((entry, i) => {
        const isUser = entry.speaker === "user";
        return (
          <div
            key={i}
            className={`flex ${isUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                isUser
                  ? "bg-aproof-coral/10 text-foreground"
                  : "bg-white border border-border text-foreground"
              }`}
            >
              <span className="block text-[10px] font-semibold mb-1 uppercase tracking-wider text-muted-foreground">
                {isUser ? "Patient" : "Assistent"}
              </span>
              {entry.text}
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
