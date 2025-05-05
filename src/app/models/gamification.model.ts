export interface GamificationSystem {
  levels: Level[]
  badges: BadgeDefinition[]
  challenges: Challenge[]
  rewards: Reward[]
  leaderboards: Leaderboard[]
}

export interface Level {
  level: number
  name: string
  xpRequired: number
  benefits: string[]
}

export interface BadgeDefinition {
  id: string
  name: string
  description: string
  iconUrl: string
  criteria: string // JSON string representing earning criteria
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary"
}

export interface Challenge {
  id: string
  name: string
  description: string
  criteria: string // JSON string representing completion criteria
  xpReward: number
  badgeReward?: string // Badge ID
  startDate: Date
  endDate: Date | null // Null for ongoing challenges
  participants: string[] // User IDs
  completedBy: string[] // User IDs
}

export interface Reward {
  id: string
  name: string
  description: string
  cost: number // XP points
  iconUrl: string
  available: boolean
  limit: number | null // Null for unlimited
  claimed: number
}

export interface Leaderboard {
  id: string
  name: string
  metric: string
  timeframe: "daily" | "weekly" | "monthly" | "all-time"
  entries: LeaderboardEntry[]
}

export interface LeaderboardEntry {
  userId: string
  score: number
  rank: number
}
