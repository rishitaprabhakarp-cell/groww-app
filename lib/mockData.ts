import type { Goal, Streak, FeedEvent, Quiz, Badge } from "@/types";

export const MOCK_USER_ID = "demo-user-123";

export const mockGoals: Goal[] = [
  {
    id: "goal-1",
    user_id: MOCK_USER_ID,
    name: "Emergency Fund",
    emoji: "🛡️",
    description: "Safety net cushion",
    target_amount: 5000,
    current_amount: 2400,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "goal-2",
    user_id: MOCK_USER_ID,
    name: "Tech & Gadgets",
    emoji: "💻",
    description: "M3 MacBook Pro upgrade",
    target_amount: 3000,
    current_amount: 1500,
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "goal-3",
    user_id: MOCK_USER_ID,
    name: "Goa Trip 🏖️",
    emoji: "✈️",
    description: "Weekend festival squad",
    target_amount: 2000,
    current_amount: 600,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const mockBadges: Badge[] = [
  {
    id: "badge-early-bird",
    name: "Early Bird",
    emoji: "🌅",
    description: "Invested before 9am",
    unlocked: true,
    unlocked_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "badge-sip-master",
    name: "SIP Master",
    emoji: "🔁",
    description: "Set up automated SIP",
    unlocked: true,
    unlocked_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "badge-first-pot",
    name: "First Pot",
    emoji: "🏦",
    description: "Created first goal bucket",
    unlocked: true,
    unlocked_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "badge-diversified",
    name: "Diversified",
    emoji: "🎯",
    description: "Complete a 7-day streak",
    unlocked: false,
  },
  {
    id: "badge-silver",
    name: "Silver Tier",
    emoji: "🥈",
    description: "Reach 10-day streak",
    unlocked: false,
  },
  {
    id: "badge-market-scholar",
    name: "Market Scholar",
    emoji: "📚",
    description: "Complete 5 quizzes",
    unlocked: false,
  },
];

export const mockStreak: Streak = {
  user_id: MOCK_USER_ID,
  current_streak: 5,
  last_activity_date: new Date().toISOString().split("T")[0],
  badges: mockBadges,
  xp: 250,
};

export const mockFeedEvents: FeedEvent[] = [
  {
    id: "feed-1",
    user_id: "user-rahul",
    display_name: "Rahul S.",
    avatar_url: "https://api.dicebear.com/9.x/avataaars/svg?seed=rahul",
    event_type: "sip_start",
    event_text: "Rahul just started a new SIP bucket! 🚀",
    event_subtitle: "Automated weekly micro-SIP 🚀",
    event_badge: "ACTIVE",
    kudos_count: 24,
    comment_count: 3,
    created_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
  {
    id: "feed-2",
    user_id: "user-ananya",
    display_name: "Ananya K.",
    avatar_url: "https://api.dicebear.com/9.x/avataaars/svg?seed=ananya",
    event_type: "goal_met",
    event_text: "Ananya reached 100% of Emergency Fund! 🎉🥳",
    event_subtitle: "6 Months Secured",
    event_badge: "Goal Met",
    kudos_count: 58,
    comment_count: 11,
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: "feed-3",
    user_id: "user-dev",
    display_name: "Dev P.",
    avatar_url: "https://api.dicebear.com/9.x/avataaars/svg?seed=devp",
    event_type: "micro_save",
    event_text: "Dev added spare change to Goa Trip pot 🏖️",
    event_subtitle: "Roundup spare change automation",
    event_badge: "STASHED",
    kudos_count: 19,
    comment_count: 1,
    created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: "feed-4",
    user_id: "user-priya",
    display_name: "Priya M.",
    avatar_url: "https://api.dicebear.com/9.x/avataaars/svg?seed=priya",
    event_type: "streak",
    event_text: "Priya completed 10-day streak! 🔥",
    event_subtitle: "Unlocked Silver Level",
    event_badge: "Tier 2",
    kudos_count: 41,
    comment_count: 7,
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
];

export const mockQuiz: Quiz = {
  id: "quiz-1",
  topic: "What is an Index Fund?",
  description: "Today's 2-Minute Quiz",
  xp_reward: 50,
  read_time: "2 min read",
  questions: [
    {
      id: "q1",
      question:
        "An Index Fund is like a basket that contains...",
      options: [
        "Only one company's stock",
        "A collection of stocks that mirrors a market index",
        "Only government bonds",
        "Real estate properties",
      ],
      correct_index: 1,
      explanation:
        "An Index Fund mirrors a market index like NIFTY 50, holding all 50 companies proportionally. Think of it like a Spotify playlist curated by the market itself!",
    },
    {
      id: "q2",
      question: "Why do Index Funds generally have lower fees?",
      options: [
        "They invest in fewer assets",
        "They are government-subsidized",
        "They are passively managed — no fund manager picking stocks",
        "They only invest in large companies",
      ],
      correct_index: 2,
      explanation:
        "No active manager = no high salary to pay. Passive management keeps expense ratios super low, like streaming music vs buying individual CDs.",
    },
    {
      id: "q3",
      question: "What is the main advantage of Index Funds for beginners?",
      options: [
        "Guaranteed returns",
        "Built-in diversification at low cost",
        "No market risk",
        "Daily dividends",
      ],
      correct_index: 1,
      explanation:
        "Instant diversification! You own a tiny slice of 50 companies for the price of one. If one company tanks, the others keep you afloat.",
    },
  ],
};
