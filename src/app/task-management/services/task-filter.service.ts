import { Injectable } from '@angular/core';
import { TaskModel } from '../models/task.model';
import { Status } from '../models/status.enum';
import { Priority } from '../models/priority.enum';

@Injectable({
  providedIn: 'root',
})
export class TaskFilterService {
  filterByStatus(tasks: TaskModel[], status: Status | null): TaskModel[] {
    if (status) {
      return tasks.filter((task) => task.status === status);
    }
    return tasks;
  }

  filterByPriority(tasks: TaskModel[], priority: Priority | null): TaskModel[] {
    if (priority) {
      return tasks.filter((task) => task.priority === priority);
    }
    return tasks;
  }
}
