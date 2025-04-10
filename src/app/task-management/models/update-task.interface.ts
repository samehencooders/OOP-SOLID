import { TaskModel } from "./task.model";

export interface UpdateTask {
    id: number;
    updatedTask: TaskModel;
  }