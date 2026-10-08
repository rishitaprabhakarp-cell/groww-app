"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Bell, User, Flame, Flag, TrendingUp, Plus, Sparkles } from "lucide-react";
import GoalBucketCard from "@/components/GoalBucketCard";
import JargonBuster from "@/components/JargonBuster";
import CreateGoalModal from "@/components/CreateGoalModal";
import { mockStreak } from "@/lib/mockData";
import { getOrCreateUser, fetchGoals, microInvest, createGoal } from "@/lib/supabase-data";
import { formatCurrency } from "@/lib/utils";
import type { Goal } from "@/types";

export default function GoalsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isJargonOpen, setIsJargonOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const streak = mockStreak;
  const maxGoals = 5;

  const loadData = useCallback(async (uid: string) => {
    const data = await fetchGoals(uid);
    setGoals(data);
  }, []);

  useEffect(() => {
    getOrCreateUser().then((uid) => {
      setUserId(uid);
      loadData(uid).finally(() => setIsLoading(false));
    });
  }, [loadData]);

  const totalStash = goals.reduce((sum, g) => sum + g.current_amount, 0);

  const handleMicroInvest = async (goalId: string) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;
    const newAmount = Math.min(goal.current_amount + 100, goal.target_amount);
    // Optimistic update
    setGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, current_amount: newAmount } : g))
    );
    try {
      await microInvest(goalId, goal.current_amount);
    } catch {
      // Revert on failure
      setGoals((prev) =>
        prev.map((g) => (g.id === goalId ? { ...g, current_amount: goal.current_amount } : g))
      );
    }
  };

  const handleCreateGoal = async (goalData: Omit<Goal, "id" | "user_id" | "created_at">) => {
    if (!userId) return;
    const newGoal = await createGoal(userId, goalData);
    setGoals((prev) => [...prev, newGoal]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen dot-pattern flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#00d4a0]/30 border-t-[#00d4a0] rounded-full animate-spin" />
          <p className="text-white/40 text-sm">Loading your stash...</p>
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
        {/* Streak + Next milestone bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-orange-500/15 border border-orange-500/20 px-3 py-1.5 rounded-full">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-bold text-orange-400">
              {streak.current_streak} DAY STREAK
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-white/50">
            <Flag className="w-3.5 h-3.5" />
            <span>Next: ₹5,000</span>
          </div>
        </div>

        {/* Total Stash Card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#141414] rounded-2xl p-5 border border-white/5"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/50">Total Stash</span>
            <div className="flex items-center gap-1.5 bg-[#00d4a0]/15 px-2.5 py-1 rounded-full">
              <TrendingUp className="w-3 h-3 text-[#00d4a0]" />
              <span className="text-xs font-bold text-[#00d4a0]">
                +₹450 this mo (+11.2%)
              </span>
            </div>
          </div>
          <div className="flex items-end gap-1 mb-2">
            <span className="text-4xl font-bold text-white">
              {formatCurrency(totalStash)}
            </span>
          </div>
          <p className="text-xs text-white/40">
            {goals.length} active micro-pots compounding daily
          </p>
        </motion.div>

        {/* Goals Section */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Target Goals</h2>
          <span className="text-xs text-white/40">
            {goals.length} of {maxGoals} used
          </span>
        </div>

        {/* Goal Cards */}
        <div className="space-y-3">
          {goals.map((goal, i) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <GoalBucketCard goal={goal} onMicroInvest={handleMicroInvest} />
            </motion.div>
          ))}
        </div>

        {/* Create new goal */}
        {goals.length < maxGoals && (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border border-dashed border-white/15 text-white/40 hover:text-white/70 hover:border-white/30 transition-all text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Create New Goal Pot
          </button>
        )}
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
      <CreateGoalModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSave={handleCreateGoal}
      />
    </div>
  );
}
