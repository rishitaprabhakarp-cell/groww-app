/**
 * Supabase data layer — all DB read/write operations.
 * Uses the browser client (client components only).
 * Falls back gracefully to mock data if Supabase is unavailable.
 */
import { createClient } from "@/utils/supabase/client";
import { mockGoals, mockStreak, mockFeedEvents, MOCK_USER_ID } from "@/lib/mockData";
import type { Goal, Streak, FeedEvent } from "@/types";

// ─── AUTH ────────────────────────────────────────────────────
/** Sign in anonymously and return the user id. Creates a session if none exists. */
export async function getOrCreateUser(): Promise<string> {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) return session.user.id;

  // Sign in anonymously
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error || !data.user) {
    console.warn("[Supabase] Anonymous sign-in failed, using mock user:", error?.message);
    return MOCK_USER_ID;
  }
  return data.user.id;
}

// ─── GOALS ───────────────────────────────────────────────────
export async function fetchGoals(userId: string): Promise<Goal[]> {
  if (userId === MOCK_USER_ID) return mockGoals;
  const supabase = createClient();
  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) {
    console.warn("[Supabase] fetchGoals failed:", error.message);
    return mockGoals;
  }
  // Seed default goals for brand-new users
  if (data.length === 0) {
    return seedDefaultGoals(userId);
  }
  return data as Goal[];
}

async function seedDefaultGoals(userId: string): Promise<Goal[]> {
  const supabase = createClient();
  const defaults = [
    { user_id: userId, name: "Emergency Fund", emoji: "🛡️", description: "Safety net cushion", target_amount: 5000, current_amount: 0 },
    { user_id: userId, name: "Tech & Gadgets", emoji: "💻", description: "Save for your next upgrade", target_amount: 3000, current_amount: 0 },
  ];
  const { data, error } = await supabase.from("goals").insert(defaults).select();
  if (error) {
    console.warn("[Supabase] seedDefaultGoals failed:", error.message);
    return mockGoals;
  }
  return data as Goal[];
}

export async function microInvest(goalId: string, currentAmount: number): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("goals")
    .update({ current_amount: currentAmount + 100 })
    .eq("id", goalId);
  if (error) throw new Error(error.message);
}

export async function createGoal(
  userId: string,
  goal: Omit<Goal, "id" | "user_id" | "created_at">
): Promise<Goal> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("goals")
    .insert({ ...goal, user_id: userId })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Goal;
}

// ─── STREAKS ─────────────────────────────────────────────────
export async function fetchStreak(userId: string): Promise<Streak> {
  if (userId === MOCK_USER_ID) return mockStreak;
  const supabase = createClient();
  const { data, error } = await supabase
    .from("streaks")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) {
    // First time — create a streak row with today's date
    const today = new Date().toISOString().split("T")[0];
    return upsertStreak(userId, { current_streak: 0, last_activity_date: today, badges: [], xp: 0 });
  }
  return { ...data, user_id: userId } as Streak;
}

export async function upsertStreak(userId: string, streak: Omit<Streak, "user_id">): Promise<Streak> {
  if (userId === MOCK_USER_ID) return { ...streak, user_id: userId };
  const supabase = createClient();
  const { data, error } = await supabase
    .from("streaks")
    .upsert({ user_id: userId, ...streak, updated_at: new Date().toISOString() })
    .select()
    .single();
  if (error) {
    console.warn("[Supabase] upsertStreak failed:", error.message);
    return { ...streak, user_id: userId };
  }
  return data as Streak;
}

/** Call on quiz completion: extend streak if today, reset if gap > 1 day */
export async function recordActivity(userId: string, xpGain: number): Promise<Streak> {
  const streak = await fetchStreak(userId);
  const today = new Date().toISOString().split("T")[0];
  const last = streak.last_activity_date;

  let newStreak = streak.current_streak;
  if (last === today) {
    // Already recorded today — no change to streak count
  } else if (last === getPreviousDay(today)) {
    newStreak += 1; // Consecutive day
  } else {
    newStreak = 1; // Gap — reset
  }

  const updated: Omit<Streak, "user_id"> = {
    current_streak: newStreak,
    last_activity_date: today,
    xp: streak.xp + xpGain,
    badges: streak.badges,
  };
  return upsertStreak(userId, updated);
}

function getPreviousDay(dateStr: string): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

// ─── FEED EVENTS ─────────────────────────────────────────────
export async function fetchFeedEvents(): Promise<FeedEvent[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("feed_events")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error || !data || data.length === 0) {
    console.warn("[Supabase] fetchFeedEvents failed or empty:", error?.message);
    return mockFeedEvents;
  }
  return data as FeedEvent[];
}

export async function incrementKudos(eventId: string, currentCount: number): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("feed_events")
    .update({ kudos_count: currentCount + 1 })
    .eq("id", eventId);
  if (error) console.warn("[Supabase] incrementKudos failed:", error.message);
}

export async function publishFeedEvent(
  userId: string,
  event: Omit<FeedEvent, "id" | "user_id" | "created_at" | "kudos_count" | "comment_count">
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("feed_events").insert({
    ...event,
    user_id: userId,
    kudos_count: 0,
    comment_count: 0,
  });
  if (error) console.warn("[Supabase] publishFeedEvent failed:", error.message);
}
