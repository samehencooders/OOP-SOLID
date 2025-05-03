export interface User {
    id: string
    name: string
    email: string
    avatarUrl: string
    role: UserRole
    teams: string[] // Team IDs
    skills: Skill[]
    xpPoints: number
    level: number
    badges: Badge[]
    preferences: UserPreferences
    lastActive: Date
  }
  
  export enum UserRole {
    MEMBER = "member",
    TEAM_LEAD = "team_lead",
    MANAGER = "manager",
    EXECUTIVE = "executive",
    ADMIN = "admin",
    QA = "qa",
  }
  
  export interface Skill {
    id: string
    name: string
    level: number // 1-5
  }
  
  export interface Badge {
    id: string
    name: string
    description: string
    iconUrl: string
    earnedAt: Date
  }
  
  export interface UserPreferences {
    theme: "light" | "dark" | "system"
    notifications: NotificationPreference[]
    dashboardLayout: any // JSON configuration
  }
  
  export interface NotificationPreference {
    type: string
    enabled: boolean
    channels: ("email" | "in-app" | "slack" | "teams")[]
  }
  