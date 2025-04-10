import { Priority } from './priority.enum';
import { Status } from './status.enum';
import { Task } from './task.interface';

export class TaskModel implements Task {
  constructor(
    public id: number,
    public title: string,
    public description: string,
    public dueDate: Date,
    public priority: Priority,
    public status: Status
  ) {}
  // isOverdue(): boolean {
  //   return this.status === Status.INCOMPLETE && this.dueDate > new Date();
  // }
}
