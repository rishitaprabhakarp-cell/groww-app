"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Badge } from "@/types";

interface BadgeGridProps {
  badges: Badge[];
}

export default function BadgeGrid({ badges }: BadgeGridProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-white">Badges & Milestones</h3>
        <span className="text-xs text-white/40">
          {badges.filter((b) => b.unlocked).length}/{badges.length}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {badges.map((badge, i) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06 }}
            className={cn(
              "relative flex flex-col items-center gap-2 p-3 rounded-2xl border text-center transition-all",
              badge.unlocked
                ? "bg-[#00d4a0]/10 border-[#00d4a0]/20"
                : "bg-[#141414] border-white/5 opacity-50"
            )}
          >
            {badge.unlocked && (
              <CheckCircle2 className="absolute top-2 right-2 w-3.5 h-3.5 text-[#00d4a0]" />
            )}
            {!badge.unlocked && (
              <Lock className="absolute top-2 right-2 w-3 h-3 text-white/20" />
            )}
            <span className="text-2xl">{badge.emoji}</span>
            <div>
              <p className="text-xs font-semibold text-white leading-tight">
                {badge.name}
              </p>
              <p
                className={cn(
                  "text-[10px] mt-0.5",
                  badge.unlocked ? "text-[#00d4a0]" : "text-white/30"
                )}
              >
                {badge.unlocked ? "Unlocked" : "Locked"}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
