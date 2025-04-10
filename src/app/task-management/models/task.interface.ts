import { Priority } from './priority.enum';
import { Status } from './status.enum';

export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: Date;
  priority: Priority;
  status: Status;
}
