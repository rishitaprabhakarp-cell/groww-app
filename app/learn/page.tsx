"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, User, Sparkles } from "lucide-react";
import StreakRing from "@/components/StreakRing";
import QuizCard from "@/components/QuizCard";
import BadgeGrid from "@/components/BadgeGrid";
import JargonBuster from "@/components/JargonBuster";
import { mockStreak, mockQuiz, mockBadges } from "@/lib/mockData";
import { getOrCreateUser, fetchStreak, recordActivity } from "@/lib/supabase-data";
import type { Streak } from "@/types";

export default function LearnPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [streak, setStreak] = useState<Streak>(mockStreak);
  const [isLoading, setIsLoading] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isJargonOpen, setIsJargonOpen] = useState(false);

  useEffect(() => {
    getOrCreateUser().then(async (uid) => {
      setUserId(uid);
      const s = await fetchStreak(uid);
      // Merge with mock badges (badges are stored in DB as jsonb, fall back to mock if empty)
      setStreak({
        ...s,
        badges: s.badges?.length ? s.badges : mockBadges,
      });
      // Check if already completed today
      const today = new Date().toISOString().split("T")[0];
      if (s.last_activity_date === today) setQuizCompleted(true);
      setIsLoading(false);
    });
  }, []);

  const handleQuizComplete = async (allCorrect: boolean) => {
    setQuizCompleted(true);
    if (!userId || !allCorrect) return;
    // Record activity in Supabase and update streak
    const updated = await recordActivity(userId, mockQuiz.xp_reward);
    setStreak((s) => ({
      ...updated,
      badges: s.badges, // keep local badge display
    }));
  };

  const dayOfStreak = Math.min(streak.current_streak % 7 || (streak.current_streak > 0 ? 7 : 0), 7);

  if (isLoading) {
    return (
      <div className="min-h-screen dot-pattern flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#00d4a0]/30 border-t-[#00d4a0] rounded-full animate-spin" />
          <p className="text-white/40 text-sm">Loading your streak...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dot-pattern">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#0d0d0d]/90 backdrop-blur-md px-4 pt-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold text-white">Groww</h1>
          <span className="text-lg font-bold text-[#00d4a0]">GenZ</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-white/50 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="w-9 h-9 rounded-full bg-[#00d4a0] flex items-center justify-center">
            <User className="w-4 h-4 text-[#0d0d0d]" />
          </button>
        </div>
      </div>

      <div className="px-4 pb-4 space-y-4">
        {/* Streak Ring */}
        <StreakRing
          currentDay={dayOfStreak}
          totalDays={7}
          streak={streak.current_streak}
        />

        {/* XP counter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-2 bg-[#141414] rounded-xl py-2.5 border border-white/5"
        >
          <span className="text-sm text-white/50">Total XP:</span>
          <span className="text-sm font-bold text-[#00d4a0]">⚡ {streak.xp} XP</span>
        </motion.div>

        {/* Daily Quiz */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {quizCompleted ? (
            <div className="bg-[#141414] rounded-2xl border border-[#00d4a0]/20 p-5 text-center">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="text-white font-bold mb-1">Today&apos;s quiz done!</h3>
              <p className="text-white/50 text-sm">Come back tomorrow for a new drop 🔥</p>
              <p className="text-[#00d4a0] text-xs mt-2 font-semibold">
                🔥 {streak.current_streak} day streak · ⚡ {streak.xp} XP total
              </p>
            </div>
          ) : (
            <QuizCard quiz={mockQuiz} onComplete={handleQuizComplete} />
          )}
        </motion.div>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <BadgeGrid badges={streak.badges} />
        </motion.div>
      </div>

      {/* Floating AI button */}
      <motion.button
        onClick={() => setIsJargonOpen(true)}
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.05 }}
        className="fixed bottom-20 right-4 w-14 h-14 bg-[#00d4a0] rounded-full shadow-lg shadow-[#00d4a0]/30 flex items-center justify-center z-40"
      >
        <Sparkles className="w-6 h-6 text-[#0d0d0d]" />
      </motion.button>

      <JargonBuster isOpen={isJargonOpen} onClose={() => setIsJargonOpen(false)} />
    </div>
  );
}
