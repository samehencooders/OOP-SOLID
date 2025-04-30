export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  ARCHIVED = 'ARCHIVED'
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export interface Task {
  id: string;
  name: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assignedTo: string;
  dueDate?: Date | string;
  tags?: string[];
  blocked: boolean;
  subtasks?: Task[]; // Now subtasks are full Task objects
  dependencies?: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
  entityId: string;
  parentId?: string; // Reference to parent task if this is a subtask
}