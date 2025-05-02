export interface Task {
  id: string
  title: string
  description: string
  stageId: string
  priority: TaskPriority
  dueDate: Date | null
  assignees: string[] // User IDs
  tags: string[]
  checklists: Checklist[]
  attachments: Attachment[]
  comments: Comment[]
  createdAt: Date
  updatedAt: Date
  createdBy: string // User ID
  estimatedTime: number // In hours
  actualTime: number // In hours
  riskScore: number // 0-100
  isBlocked: boolean
  blockReason?: string
}

export enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

export interface Checklist {
  id: string
  title: string
  items: ChecklistItem[]
}

export interface ChecklistItem {
  id: string
  content: string
  isCompleted: boolean
  assignee?: string // User ID
}

export interface Attachment {
  id: string
  name: string
  url: string
  type: string
  size: number
  uploadedAt: Date
  uploadedBy: string // User ID
}

export interface Comment {
  id: string
  content: string
  createdAt: Date
  createdBy: string // User ID
  mentions: string[] // User IDs
  attachments: Attachment[]
  parentId?: string // For threaded comments
  isEdited: boolean
}
