export interface Goal {
  id: string;
  user_id: string;
  name: string;
  emoji: string;
  target_amount: number;
  current_amount: number;
  description?: string;
  created_at: string;
}

export interface Streak {
  user_id: string;
  current_streak: number;
  last_activity_date: string;
  badges: Badge[];
  xp: number;
}

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  unlocked: boolean;
  unlocked_at?: string;
}

export interface FeedEvent {
  id: string;
  user_id: string;
  display_name: string;
  avatar_url: string;
  event_type: "streak" | "goal_met" | "micro_save" | "sip_start" | "milestone";
  event_text: string;
  event_subtitle?: string;
  event_badge?: string;
  kudos_count: number;
  comment_count: number;
  created_at: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  topic: string;
  description: string;
  xp_reward: number;
  read_time: string;
  questions: QuizQuestion[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}
