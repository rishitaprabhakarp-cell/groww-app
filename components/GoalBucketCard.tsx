"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, CheckCircle2 } from "lucide-react";
import { cn, formatCurrency, getProgressPercent } from "@/lib/utils";
import type { Goal } from "@/types";

interface GoalBucketCardProps {
  goal: Goal;
  onMicroInvest: (goalId: string) => Promise<void>;
}

export default function GoalBucketCard({ goal, onMicroInvest }: GoalBucketCardProps) {
  const [isInvesting, setIsInvesting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const progress = getProgressPercent(goal.current_amount, goal.target_amount);

  const handleMicroInvest = async () => {
    if (isInvesting) return;
    setIsInvesting(true);
    try {
      await onMicroInvest(goal.id);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1500);
    } finally {
      setIsInvesting(false);
    }
  };

  return (
    <motion.div
      layout
      className="bg-[#141414] rounded-2xl p-4 border border-white/5"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1e1e1e] flex items-center justify-center text-xl">
            {goal.emoji}
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">{goal.name}</h3>
            {goal.description && (
              <p className="text-xs text-white/40 mt-0.5">{goal.description}</p>
            )}
          </div>
        </div>
        <span
          className={cn(
            "text-xs font-bold px-2 py-1 rounded-full",
            progress >= 100
              ? "bg-[#00d4a0]/20 text-[#00d4a0]"
              : "bg-white/5 text-white/60"
          )}
        >
          {progress}%
        </span>
      </div>

      {/* Amount row */}
      <div className="flex justify-between text-xs text-white/50 mb-2 px-0.5">
        <span className="text-white font-medium">
          {formatCurrency(goal.current_amount)}
        </span>
        <span>{formatCurrency(goal.target_amount)}</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-white/10 rounded-full mb-4 overflow-hidden">
        <motion.div
          className="h-full bg-[#00d4a0] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      {/* Micro-Invest Button */}
      <motion.button
        onClick={handleMicroInvest}
        disabled={isInvesting || progress >= 100}
        whileTap={{ scale: 0.97 }}
        className={cn(
          "w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-200",
          progress >= 100
            ? "bg-[#00d4a0]/20 text-[#00d4a0] cursor-default"
            : "bg-[#00d4a0] text-[#0d0d0d] hover:bg-[#00e8af] active:scale-95"
        )}
      >
        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.span
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              +₹100 Added!
            </motion.span>
          ) : progress >= 100 ? (
            <motion.span key="done" className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Goal Reached! 🎉
            </motion.span>
          ) : (
            <motion.span key="invest" className="flex items-center gap-2">
              {isInvesting ? (
                <span className="w-4 h-4 border-2 border-[#0d0d0d]/40 border-t-[#0d0d0d] rounded-full animate-spin" />
              ) : (
                <PlusCircle className="w-4 h-4" />
              )}
              Micro-Invest (+₹100)
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
}
