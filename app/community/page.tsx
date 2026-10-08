"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, User, Radio, UserPlus, Sparkles, Send, X, Pencil } from "lucide-react";
import FeedCard from "@/components/FeedCard";
import JargonBuster from "@/components/JargonBuster";
import { fetchFeedEvents, incrementKudos } from "@/lib/supabase-data";
import { mockFeedEvents } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import type { FeedEvent } from "@/types";

type FilterTab = "all" | "milestones" | "streaks";

const FILTER_TABS: { id: FilterTab; label: string; emoji: string }[] = [
  { id: "all", label: "All", emoji: "⚡" },
  { id: "milestones", label: "Milestones", emoji: "🏆" },
  { id: "streaks", label: "Streaks", emoji: "🔥" },
];

const SHARE_TEMPLATES = [
  { text: "Just hit a new savings milestone! 🎯", type: "milestone" as const },
  { text: "Day streak going strong 🔥 consistency is key!", type: "streak" as const },
  { text: "Started a new SIP bucket today 🚀", type: "sip_start" as const },
  { text: "Micro-investing daily — small steps, big stash 💪", type: "micro_save" as const },
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
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareText, setShareText] = useState("");

  useEffect(() => {
    fetchFeedEvents()
      .then(setFeedEvents)
      .finally(() => setIsLoading(false));
  }, []);

  const handleKudos = async (id: string) => {
    const event = feedEvents.find((e) => e.id === id);
    if (!event) return;
    setFeedEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, kudos_count: e.kudos_count + 1 } : e))
    );
    await incrementKudos(id, event.kudos_count);
  };

  const handleShare = () => {
    if (!shareText.trim()) return;
    // Optimistically add to feed
    const newEvent: FeedEvent = {
      id: `local-${Date.now()}`,
      user_id: "me",
      display_name: "You",
      avatar_url: "https://api.dicebear.com/9.x/avataaars/svg?seed=me",
      event_type: "milestone",
      event_text: shareText,
      kudos_count: 0,
      comment_count: 0,
      created_at: new Date().toISOString(),
    };
    setFeedEvents((prev) => [newEvent, ...prev]);
    setShareText("");
    setIsShareOpen(false);
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

      <div className="px-4 pb-24 space-y-4">
        {/* Page title */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h2 className="text-2xl font-bold text-white">Squad Pulse</h2>
              <div className="flex items-center gap-1 bg-green-500/10 border border-green-500/15 px-2 py-0.5 rounded-lg">
                <Radio className="w-2.5 h-2.5 text-green-400 animate-pulse" />
                <span className="text-[10px] font-bold text-green-400 tracking-wider">LIVE</span>
              </div>
            </div>
            <p className="text-xs text-white/40">Real-time habits & wins from your tribe</p>
          </div>
          {/* Share button */}
          <button
            onClick={() => setIsShareOpen(true)}
            className="flex items-center gap-1.5 bg-[#00d4a0] text-[#0d0d0d] text-xs font-bold px-3 py-2 rounded-xl hover:bg-[#00e8af] transition-colors"
          >
            <Pencil className="w-3 h-3" />
            Share
          </button>
        </div>

        {/* Filter tabs — dark pill style, on-theme */}
        <div className="flex gap-2">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all",
                activeTab === tab.id
                  ? "bg-[#00d4a0] text-[#0d0d0d]"
                  : "bg-[#1a1a1a] text-white/50 hover:text-white/80 hover:bg-[#222]"
              )}
            >
              <span>{tab.emoji}</span>
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
          <div className="text-center py-12">
            <p className="text-white/20 text-3xl mb-3">👀</p>
            <p className="text-white/40 text-sm">No events here yet</p>
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

        {/* Invite Squad card — on-theme dark style */}
        <div className="bg-[#141414] rounded-2xl border border-white/5 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00d4a0]/10 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-[#00d4a0]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Invite your Squad</p>
              <p className="text-xs text-white/40">Streak multiplier unlocks at 3 friends</p>
            </div>
          </div>
          <button className="bg-[#00d4a0]/10 border border-[#00d4a0]/20 text-[#00d4a0] text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#00d4a0]/20 transition-colors">
            Invite
          </button>
        </div>
      </div>

      {/* Share sheet */}
      <AnimatePresence>
        {isShareOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed top-0 left-0 right-0 bg-black/70 z-50"
              style={{ bottom: "64px" }}
              onClick={() => setIsShareOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              className="fixed left-0 right-0 z-50 bg-[#111111] rounded-t-3xl border-t border-white/10 p-5"
              style={{ bottom: "64px" }}
            >
              <div className="flex justify-center mb-4">
                <div className="w-10 h-1 bg-white/20 rounded-full" />
              </div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold">Share a Win 🎉</h3>
                <button
                  onClick={() => setIsShareOpen(false)}
                  className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-white/50"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Quick templates */}
              <div className="flex flex-col gap-2 mb-4">
                {SHARE_TEMPLATES.map((t) => (
                  <button
                    key={t.text}
                    onClick={() => setShareText(t.text)}
                    className={cn(
                      "text-left text-xs px-3 py-2.5 rounded-xl border transition-all",
                      shareText === t.text
                        ? "bg-[#00d4a0]/10 border-[#00d4a0]/30 text-[#00d4a0]"
                        : "bg-white/5 border-white/5 text-white/60 hover:text-white/80 hover:bg-white/8"
                    )}
                  >
                    {t.text}
                  </button>
                ))}
              </div>

              {/* Custom input */}
              <div className="flex items-center gap-2 bg-[#1e1e1e] rounded-xl border border-white/10 px-3 py-2 mb-4">
                <input
                  type="text"
                  value={shareText}
                  onChange={(e) => setShareText(e.target.value)}
                  placeholder="Or write your own..."
                  className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
                  onKeyDown={(e) => e.key === "Enter" && handleShare()}
                />
              </div>

              <button
                onClick={handleShare}
                disabled={!shareText.trim()}
                className={cn(
                  "w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all",
                  shareText.trim()
                    ? "bg-[#00d4a0] text-[#0d0d0d] hover:bg-[#00e8af]"
                    : "bg-white/5 text-white/30 cursor-not-allowed"
                )}
              >
                <Send className="w-4 h-4" />
                Post to Squad
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
