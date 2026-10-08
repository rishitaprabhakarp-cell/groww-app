"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, User, Radio, UserPlus, Sparkles } from "lucide-react";
import FeedCard from "@/components/FeedCard";
import JargonBuster from "@/components/JargonBuster";
import { fetchFeedEvents, incrementKudos } from "@/lib/supabase-data";
import { cn } from "@/lib/utils";
import type { FeedEvent } from "@/types";

type FilterTab = "all" | "friends" | "milestones" | "streaks";

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "friends", label: "Friends" },
  { id: "milestones", label: "Milestones" },
  { id: "streaks", label: "Streaks" },
];

function filterEvents(events: FeedEvent[], tab: FilterTab): FeedEvent[] {
  if (tab === "all") return events;
  if (tab === "milestones") return events.filter((e) => e.event_type === "goal_met" || e.event_type === "milestone");
  if (tab === "streaks") return events.filter((e) => e.event_type === "streak");
  return events;
}

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [feedEvents, setFeedEvents] = useState<FeedEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isJargonOpen, setIsJargonOpen] = useState(false);

  useEffect(() => {
    fetchFeedEvents()
      .then(setFeedEvents)
      .finally(() => setIsLoading(false));
  }, []);

  const handleKudos = async (id: string) => {
    const event = feedEvents.find((e) => e.id === id);
    if (!event) return;
    // Optimistic update
    setFeedEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, kudos_count: e.kudos_count + 1 } : e))
    );
    await incrementKudos(id, event.kudos_count);
  };

  const filtered = filterEvents(feedEvents, activeTab);

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
        {/* Page title */}
        <div>
          <div className="flex items-center justify-between mb-0.5">
            <h2 className="text-2xl font-bold text-white">Squad Pulse</h2>
            <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full">
              <Radio className="w-3 h-3 text-green-400 animate-pulse" />
              <span className="text-xs font-bold text-green-400">LIVE</span>
            </div>
          </div>
          <p className="text-sm text-white/40">Real-time habits & wins from your tribe</p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all border",
                activeTab === tab.id
                  ? "bg-[#00d4a0] text-[#0d0d0d] border-transparent"
                  : "bg-transparent text-white/50 border-white/10 hover:text-white/80"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Feed */}
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#141414] rounded-2xl border border-white/5 p-4 animate-pulse">
                <div className="flex gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-white/5" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-white/5 rounded w-1/3" />
                    <div className="h-3 bg-white/5 rounded w-1/5" />
                  </div>
                </div>
                <div className="h-4 bg-white/5 rounded w-3/4 mb-2" />
                <div className="h-8 bg-white/5 rounded" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-white/30 text-sm">
            No events here yet 👀
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((event, i) => (
              <FeedCard
                key={event.id}
                event={event}
                onKudos={handleKudos}
                index={i}
              />
            ))}
          </div>
        )}

        {/* Invite Squad card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-between bg-[#141414] rounded-2xl p-4 border border-white/5"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#00d4a0]/15 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-[#00d4a0]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Invite your Squad</p>
              <p className="text-xs text-white/40">
                Habit streak multiplier unlocks at 3 fri...
              </p>
            </div>
          </div>
          <button className="bg-[#00d4a0] text-[#0d0d0d] text-xs font-bold px-4 py-2 rounded-full hover:bg-[#00e8af] transition-colors">
            Invite
          </button>
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
