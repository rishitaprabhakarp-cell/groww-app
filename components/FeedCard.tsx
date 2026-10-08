"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, Trophy } from "lucide-react";
import { cn, timeAgo } from "@/lib/utils";
import type { FeedEvent } from "@/types";

const EVENT_TYPE_CONFIG = {
  sip_start: { color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", label: "Tech Fund" },
  goal_met: { color: "text-[#00d4a0]", bg: "bg-[#00d4a0]/10 border-[#00d4a0]/20", label: "Goal Met" },
  micro_save: { color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20", label: "Micro-Save" },
  streak: { color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20", label: "Streak Champ" },
  milestone: { color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20", label: "Milestone" },
};

interface FeedCardProps {
  event: FeedEvent;
  onKudos: (id: string) => void;
  index: number;
}

export default function FeedCard({ event, onKudos, index }: FeedCardProps) {
  const [hasKudosed, setHasKudosed] = useState(false);
  const [localKudos, setLocalKudos] = useState(event.kudos_count);
  const config = EVENT_TYPE_CONFIG[event.event_type];

  const handleKudos = () => {
    if (hasKudosed) return;
    setHasKudosed(true);
    setLocalKudos((k) => k + 1);
    onKudos(event.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="bg-[#141414] rounded-2xl border border-white/5 p-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={event.avatar_url}
              alt={event.display_name}
              className="w-10 h-10 rounded-full bg-white/10"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://api.dicebear.com/9.x/initials/svg?seed=${event.display_name}`;
              }}
            />
            {event.event_type === "goal_met" && (
              <span className="absolute -bottom-1 -right-1 text-sm">✅</span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">{event.display_name}</span>
              {event.event_type === "goal_met" && (
                <span className="text-[#00d4a0]">✓</span>
              )}
            </div>
            <span className="text-xs text-white/40">{timeAgo(event.created_at)}</span>
          </div>
        </div>
        <span className={cn("text-[10px] font-bold px-2 py-1 rounded-full border", config.bg, config.color)}>
          {config.label}
        </span>
      </div>

      {/* Event text */}
      <p className="text-white font-semibold text-sm mb-3">{event.event_text}</p>

      {/* Event detail card */}
      {event.event_subtitle && (
        <div className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2 mb-3">
          <div className="flex items-center gap-2">
            {event.event_type === "goal_met" && (
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-white/60">{event.event_subtitle}</span>
                  <span className="text-xs text-[#00d4a0] font-bold">100%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[#00d4a0] rounded-full w-full" />
                </div>
              </div>
            )}
            {event.event_type !== "goal_met" && (
              <>
                <span className="text-[10px] text-white/50">{event.event_subtitle}</span>
              </>
            )}
          </div>
          {event.event_badge && event.event_type !== "goal_met" && (
            <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", config.bg, config.color)}>
              {event.event_badge}
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleKudos}
            className={cn(
              "flex items-center gap-1.5 text-xs font-medium transition-all",
              hasKudosed ? "text-red-400" : "text-white/40 hover:text-white/70"
            )}
          >
            <motion.div
              animate={hasKudosed ? { scale: [1, 1.4, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Heart className={cn("w-4 h-4", hasKudosed && "fill-red-400")} />
            </motion.div>
            {localKudos}
          </button>
          <button className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 font-medium">
            <MessageCircle className="w-4 h-4" />
            {event.comment_count}
          </button>
        </div>
        <button className="text-white/30 hover:text-white/60 transition-colors">
          {event.event_type === "streak" ? (
            <Trophy className="w-4 h-4 text-yellow-500/60" />
          ) : (
            <Share2 className="w-4 h-4" />
          )}
        </button>
      </div>
    </motion.div>
  );
}
