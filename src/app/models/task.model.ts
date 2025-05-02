export type Priority = 'low' | 'medium' | 'high' | 'critical';
export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: Priority;
  dueDate: Date;
  assignee: User | null;
  tags: string[];
  attachments: Attachment[];
  comments: Comment[];
  checklists: Checklist[];
  createdAt: Date;
  updatedAt: Date;
  estimatedTime: number; // in hours
  actualTime: number; // in hours
  riskScore: number; // 0-100
  aiSuggestions?: string[];
}
export interface User {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  department: string;
  xpPoints: number;
  badges: Badge[];
  skills: Skill[];
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
  uploadedBy: User;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  author: User;
  mentions: User[];
}
export interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
}
export interface ChecklistItem {
  id: string;
  content: string;
  completed: boolean;
  assignee?: User;
}
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
}
export interface Skill {
  id: string;
  name: string;
  level: number; // 1-5
}

export interface WorkflowStage {
  id: string;
  name: string;
  order: number;
  wipLimit: number;
  tasks: Task[];
  color: string;
  isEntryPoint: boolean;
  isExitPoint: boolean;
  transitionRules?: TransitionRule[];
}

export interface TransitionRule {
  id: string;
  condition: string;
  targetStageId: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  stages: WorkflowStage[];
  members: User[];
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  progress: number; // 0-100
  riskScore: number; // 0-100
}

export interface AnalyticsData {
  cycleTime: number[];
  leadTime: number[];
  throughput: number[];
  wipViolations: number;
  flowEfficiency: number;
  riskPredictions: RiskPrediction[];
  bottlenecks: Bottleneck[];
}

export interface RiskPrediction {
  taskId: string;
  probability: number;
  factors: string[];
}

export interface Bottleneck {
  stageId: string;
  severity: number; // 0-100
  suggestedActions: string[];
}
