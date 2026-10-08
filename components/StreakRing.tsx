"use client";

import { motion } from "framer-motion";

interface StreakRingProps {
  currentDay: number;
  totalDays?: number;
  streak: number;
  daysUntilNext?: number;
}

export default function StreakRing({ currentDay, totalDays = 7, streak, daysUntilNext }: StreakRingProps) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = (currentDay / totalDays) * circumference;

  return (
    <div className="flex flex-col items-center gap-4 py-8 bg-[#141414] rounded-2xl border border-white/5">
      <div className="relative w-36 h-36 flex items-center justify-center">
        {/* Background ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 128 128">
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="8"
          />
          {/* Progress ring */}
          <motion.circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke="#00d4a0"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            style={{ filter: "drop-shadow(0 0 6px rgba(0,212,160,0.5))" }}
          />
        </svg>

        {/* Center content */}
        <div className="flex flex-col items-center z-10">
          <span className="text-3xl">🔥</span>
          <span className="text-xs text-white/40 mt-1 font-medium">
            DAY {currentDay}/{totalDays}
          </span>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">
          {streak} Day Streak 🔥
        </h2>
        <p className="text-sm text-white/50 mt-1">
          {(daysUntilNext ?? totalDays - currentDay)} days until Next Milestone Reward
        </p>
        <div className="mt-3 inline-flex items-center gap-2 bg-[#00d4a0]/10 text-[#00d4a0] text-xs font-semibold px-3 py-1.5 rounded-full">
          <span>💰</span>
          <span>+₹50 BONUS POT</span>
        </div>
      </div>
    </div>
  );
}
