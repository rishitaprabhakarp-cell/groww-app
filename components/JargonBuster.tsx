"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types";

const QUICK_CHIPS = [
  "Expense Ratio",
  "Index Fund",
  "Bull vs Bear 🐂",
  "SIP",
  "NAV",
  "Mutual Fund",
];

interface JargonBusterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JargonBuster({ isOpen, onClose }: JargonBusterProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hey! I'm the Jargon Buster. What confusing finance term can I translate for you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setIsLoading(true);

    // Add placeholder AI message
    const aiId = (Date.now() + 1).toString();
    setMessages((m) => [
      ...m,
      { id: aiId, role: "assistant", content: "", timestamp: new Date() },
    ]);

    try {
      const res = await fetch("/api/jargon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok) throw new Error("API error");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          // Parse SSE lines
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") break;
              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  accumulated += parsed.text;
                  setMessages((m) =>
                    m.map((msg) =>
                      msg.id === aiId ? { ...msg, content: accumulated } : msg
                    )
                  );
                }
              } catch {
                // skip
              }
            }
          }
        }
      }
    } catch {
      setMessages((m) =>
        m.map((msg) =>
          msg.id === aiId
            ? {
                ...msg,
                content:
                  "Oops, something went wrong. Try again in a sec! 🤙",
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 right-0 bg-black/70 z-50"
            style={{ bottom: "64px" }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            className="fixed left-0 right-0 z-50 bg-[#111111] rounded-t-3xl border-t border-white/10 flex flex-col"
            style={{ bottom: "64px", height: "68vh", maxHeight: "560px", minHeight: "380px" }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-white/20 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#00d4a0]/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#00d4a0]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">Jargon Buster</span>
                    <span className="text-[10px] bg-[#00d4a0]/20 text-[#00d4a0] px-2 py-0.5 rounded-full font-bold">
                      AI BOT
                    </span>
                  </div>
                  <p className="text-[10px] text-white/40 tracking-widest">
                    AI FINANCIAL TRANSLATOR • POWERED BY GROWW
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-hide">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-[#00d4a0]/20 flex items-center justify-center mr-2 mt-1 shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-[#00d4a0]" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed",
                      msg.role === "user"
                        ? "bg-[#00d4a0] text-[#0d0d0d] font-medium rounded-tr-sm"
                        : "bg-[#1e1e1e] text-white/90 rounded-tl-sm"
                    )}
                  >
                    {msg.content || (
                      <span className="flex gap-1 items-center h-5">
                        <motion.span
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
                          className="w-1.5 h-1.5 bg-white/40 rounded-full"
                        />
                        <motion.span
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
                          className="w-1.5 h-1.5 bg-white/40 rounded-full"
                        />
                        <motion.span
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
                          className="w-1.5 h-1.5 bg-white/40 rounded-full"
                        />
                      </span>
                    )}
                    {msg.role === "assistant" && msg.id === "welcome" && (
                      <p className="text-xs text-white/40 mt-1">
                        Just now • Instant simple translations
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {/* Quick chips — show after welcome */}
              {messages.length === 1 && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-full bg-[#00d4a0]/20 flex items-center justify-center shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-[#00d4a0]" />
                    </div>
                    <div className="bg-[#1e1e1e] rounded-2xl rounded-tl-sm px-4 py-3">
                      <p className="text-sm text-white/90">
                        Tap any term below or ask your own question in plain English!
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick chips */}
            <div className="px-4 py-2 border-t border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] text-white/40 font-semibold tracking-widest">
                  POPULAR RIGHT NOW
                </span>
                <span className="text-[10px] text-white/30">Slide to explore →</span>
              </div>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                {QUICK_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => sendMessage(chip)}
                    className="shrink-0 flex items-center gap-1 bg-white/5 hover:bg-[#00d4a0]/10 border border-white/10 hover:border-[#00d4a0]/30 text-white/70 hover:text-[#00d4a0] text-xs font-medium px-3 py-1.5 rounded-full transition-all"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="px-4 pb-3 pt-2">
              <div className="flex items-center gap-2 bg-[#1e1e1e] rounded-2xl border border-white/10 px-4 py-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                  placeholder="Ask anything, e.g. What is NAV?..."
                  className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isLoading}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                    input.trim() && !isLoading
                      ? "bg-[#00d4a0] text-[#0d0d0d] hover:scale-105"
                      : "bg-white/5 text-white/30 cursor-not-allowed"
                  )}
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
