"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Goal } from "@/types";

const EMOJI_OPTIONS = ["🛡️", "💻", "✈️", "🏎️", "📚", "🎮", "🏠", "💎", "🎵", "🌍"];

interface CreateGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goal: Omit<Goal, "id" | "user_id" | "created_at">) => Promise<void>;
}

export default function CreateGoalModal({ isOpen, onClose, onSave }: CreateGoalModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [emoji, setEmoji] = useState("🎯");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!name || !targetAmount || Number(targetAmount) <= 0) return;
    setIsSaving(true);
    try {
      await onSave({
        name,
        emoji,
        description,
        target_amount: Number(targetAmount),
        current_amount: 0,
      });
      // Reset
      setName("");
      setDescription("");
      setTargetAmount("");
      setEmoji("🎯");
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#111111] rounded-t-3xl border-t border-white/10 p-6 pb-8 overflow-y-auto"
            style={{ maxHeight: "90vh" }}
          >
            <div className="flex justify-center mb-4">
              <div className="w-10 h-1 bg-white/20 rounded-full" />
            </div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Create New Goal Pot</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Emoji picker */}
            <div className="mb-4">
              <label className="text-xs text-white/40 mb-2 block font-medium">Choose an icon</label>
              <div className="flex gap-2 flex-wrap">
                {EMOJI_OPTIONS.map((e) => (
                  <button
                    key={e}
                    onClick={() => setEmoji(e)}
                    className={cn(
                      "w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all",
                      emoji === e
                        ? "bg-[#00d4a0]/20 border border-[#00d4a0]"
                        : "bg-white/5 border border-white/5"
                    )}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div className="mb-3">
              <label className="text-xs text-white/40 mb-1.5 block font-medium">Goal Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. New Laptop"
                className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-[#00d4a0]/50"
              />
            </div>

            {/* Description */}
            <div className="mb-3">
              <label className="text-xs text-white/40 mb-1.5 block font-medium">Description (optional)</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. M3 MacBook Pro upgrade"
                className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-[#00d4a0]/50"
              />
            </div>

            {/* Target */}
            <div className="mb-6">
              <label className="text-xs text-white/40 mb-1.5 block font-medium">Target Amount (₹)</label>
              <input
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="e.g. 5000"
                className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-[#00d4a0]/50"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={!name || !targetAmount || isSaving}
              className={cn(
                "w-full py-4 rounded-xl font-bold text-sm transition-all",
                name && targetAmount
                  ? "bg-[#00d4a0] text-[#0d0d0d] hover:bg-[#00e8af]"
                  : "bg-white/5 text-white/30 cursor-not-allowed"
              )}
            >
              {isSaving ? "Creating..." : "Create Goal Pot ✨"}
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
