import { Injectable } from '@angular/core';
import { TaskModel } from '../models/task.model';
import { Priority } from '../models/priority.enum';
import { Status } from '../models/status.enum';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasks: TaskModel[] = [
    new TaskModel(
      1,
      'Complete Angular Project',
      'Finish the remaining parts',
      new Date('2023-10-01'),
      Priority.HIGH,
      Status.INCOMPLETE
    ),
    new TaskModel(
      2,
      'Prepare for Interview',
      'Review resume and cover letter',
      new Date('2023-10-05'),
      Priority.MEDIUM,
      Status.INCOMPLETE
    ),
    new TaskModel(
      3,
      'Call Mom',
      'Schedule a meeting with Mom',
      new Date('2023-10-03'),
      Priority.LOW,
      Status.INCOMPLETE
    ),
  ];
  private isDataChangedObs$ = new BehaviorSubject<boolean>(false);
  dataChanged = this.isDataChangedObs$.asObservable();

  getTasks(): TaskModel[] {
    return this.tasks;
  }
  executeAddOrUpdate(task: TaskModel, id?: number): TaskModel {
    if (id) {
      return this.updateTask(id, task);
    } else {
      const generatedId = this.generateNewId();
      const newTask: TaskModel = { ...task, id: generatedId };
      this.addTask(newTask);
      return newTask;
    }
  }
  addTask(task: TaskModel): void {
    this.tasks.push(task);
    this.updateChanges();
  }
  updateTask(id: number, updatedTask: Partial<TaskModel>): TaskModel {
    debugger;
    const index = this.tasks.findIndex((x) => x.id === id);
    this.tasks[index] = { ...this.tasks[index], ...updatedTask };
    this.updateChanges();
     return this.tasks[index] as TaskModel;
  }

  deleteTask(id: number): void {
    const index = this.tasks.findIndex((x) => x.id === id);
    // delete this.tasks[id];
    this.tasks.splice(index, 1);
    this.updateChanges();
  }
  private updateData() {
    this.isDataChangedObs$.next(true);
  }
  private updateChanges() {
    this.updateData();
    this.isDataChangedObs$.next(false);
  }
  private generateNewId(): number {
    return Math.floor(Math.random() * 1000000);
  }
}
