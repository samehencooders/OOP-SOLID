import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Task, TaskStatus } from '../models/task.model';
import { User } from '../models/user.model';
import { map, tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KanbanBoardService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  private usersSubject = new BehaviorSubject<User[]>([]);
  private wipLimitsSubject = new BehaviorSubject<Record<string, number>>({});
  
  // Base API URL - would come from environment in a real app
  private apiUrl = 'http://localhost:3000';
  
  tasks$ = this.tasksSubject.asObservable();
  users$ = this.usersSubject.asObservable();
  wipLimits$ = this.wipLimitsSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadData(entityId: string): void {
    // Fetch data from json-server
    this.fetchTasks(entityId).subscribe(
      () => console.log('Tasks loaded successfully'),
      error => console.error('Error loading tasks:', error)
    );
    
    this.fetchUsers().subscribe(
      () => console.log('Users loaded successfully'),
      error => console.error('Error loading users:', error)
    );
    
    this.fetchWipLimits().subscribe(
      () => console.log('WIP limits loaded successfully'),
      error => console.error('Error loading WIP limits:', error)
    );
  }

  fetchTasks(entityId: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/tasks?entityId=${entityId}`)
      .pipe(
        tap(tasks => this.tasksSubject.next(tasks)),
        catchError(error => {
          console.error('Error fetching tasks:', error);
          return of([]);
        })
      );
  }

  fetchUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`)
      .pipe(
        tap(users => this.usersSubject.next(users)),
        catchError(error => {
          console.error('Error fetching users:', error);
          return of([]);
        })
      );
  }

  fetchWipLimits(): Observable<Record<string, number>> {
    return this.http.get<Record<string, number>>(`${this.apiUrl}/wip-limits`)
      .pipe(
        tap(limits => this.wipLimitsSubject.next(limits)),
        catchError(error => {
          console.error('Error fetching WIP limits:', error);
          return of({});
        })
      );
  }

  updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/tasks/${task.id}`, task)
      .pipe(
        tap(() => {
          const currentTasks = this.tasksSubject.value;
          const updatedTasks = this.updateTaskInList(currentTasks, task);
          this.tasksSubject.next(updatedTasks);
        }),
        catchError(error => {
          console.error('Error updating task:', error);
          return of(task);
        })
      );
  }

  // Helper method to update a task in the task list, including nested subtasks
  private updateTaskInList(tasks: Task[], updatedTask: Task): Task[] {
    return tasks.map(task => {
      if (task.id === updatedTask.id) {
        return updatedTask;
      }
      
      // Check if the task has subtasks that need updating
      if (task.subtasks && task.subtasks.length > 0) {
        return {
          ...task,
          subtasks: this.updateTaskInList(task.subtasks, updatedTask)
        };
      }
      
      return task;
    });
  }

  createTask(task: Partial<Task>, parentId?: string): Observable<Task> {
    const newTask = {
      ...task,
      id: task.id || `task-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      parentId: parentId
    } as Task;

    if (parentId) {
      // This is a subtask, add it to the parent task
      return this.addSubtaskToParent(newTask, parentId);
    } else {
      // This is a top-level task
      return this.http.post<Task>(`${this.apiUrl}/tasks`, newTask)
        .pipe(
          tap(createdTask => {
            const currentTasks = this.tasksSubject.value;
            this.tasksSubject.next([...currentTasks, createdTask]);
          }),
          catchError(error => {
            console.error('Error creating task:', error);
            // Return the task anyway for better UX
            return of(newTask);
          })
        );
    }
  }

  // Helper method to add a subtask to a parent task
  private addSubtaskToParent(subtask: Task, parentId: string): Observable<Task> {
    const currentTasks = this.tasksSubject.value;
    const parentTask = this.findTaskById(currentTasks, parentId);
    
    if (!parentTask) {
      return of(subtask); // Parent not found, return subtask anyway
    }
    
    const updatedParent = {
      ...parentTask,
      subtasks: [...(parentTask.subtasks || []), subtask],
      updatedAt: new Date()
    };
    
    return this.updateTask(updatedParent).pipe(
      map(() => subtask) // Return the subtask after updating the parent
    );
  }

  // Helper method to find a task by ID, including in subtasks
  private findTaskById(tasks: Task[], taskId: string): Task | undefined {
    for (const task of tasks) {
      if (task.id === taskId) {
        return task;
      }
      
      if (task.subtasks && task.subtasks.length > 0) {
        const foundInSubtasks = this.findTaskById(task.subtasks, taskId);
        if (foundInSubtasks) {
          return foundInSubtasks;
        }
      }
    }
    
    return undefined;
  }

  updateWipLimit(userId: string, limit: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/wip-limits/${userId}`, { limit })
      .pipe(
        tap(() => {
          const currentLimits = this.wipLimitsSubject.value;
          this.wipLimitsSubject.next({
            ...currentLimits,
            [userId]: limit
          });
        }),
        catchError(error => {
          console.error('Error updating WIP limit:', error);
          // Update the local state anyway for better UX
          const currentLimits = this.wipLimitsSubject.value;
          this.wipLimitsSubject.next({
            ...currentLimits,
            [userId]: limit
          });
          return of(undefined);
        })
      );
  }

  bulkArchiveTasks(userIds: string[]): Observable<void> {
    // For json-server, we need to update each task individually
    const currentTasks = this.tasksSubject.value;
    const tasksToUpdate = this.findTasksToArchive(currentTasks, userIds);
    
    // Update tasks locally first for better UX
    const updatedTasks = this.updateTasksStatus(currentTasks, userIds);
    this.tasksSubject.next(updatedTasks);
    
    // Then update on the server
    const updatePromises = tasksToUpdate.map(task => 
      this.http.put(`${this.apiUrl}/tasks/${task.id}`, 
        { ...task, status: TaskStatus.ARCHIVED }
      ).toPromise()
    );
    
    return of(undefined);
  }

  // Helper method to find all tasks (including subtasks) to archive
  private findTasksToArchive(tasks: Task[], userIds: string[]): Task[] {
    let tasksToArchive: Task[] = [];
    
    for (const task of tasks) {
      if (userIds.includes(task.assignedTo) && task.status === TaskStatus.DONE) {
        tasksToArchive.push(task);
      }
      
      if (task.subtasks && task.subtasks.length > 0) {
        tasksToArchive = [
          ...tasksToArchive,
          ...this.findTasksToArchive(task.subtasks, userIds)
        ];
      }
    }
    
    return tasksToArchive;
  }

  // Helper method to update task status recursively
  private updateTasksStatus(tasks: Task[], userIds: string[]): Task[] {
    return tasks.map(task => {
      let updatedTask = { ...task };
      
      if (userIds.includes(task.assignedTo) && task.status === TaskStatus.DONE) {
        updatedTask.status = TaskStatus.ARCHIVED;
      }
      
      if (task.subtasks && task.subtasks.length > 0) {
        updatedTask.subtasks = this.updateTasksStatus(task.subtasks, userIds);
      }
      
      return updatedTask;
    });
  }

  moveTask(taskId: string, toUserId: string): Observable<Task> {
    const currentTasks = this.tasksSubject.value;
    const taskToMove = this.findTaskById(currentTasks, taskId);
    
    if (!taskToMove) {
      throw new Error('Task not found');
    }
    
    const updatedTask = {
      ...taskToMove,
      assignedTo: toUserId,
      updatedAt: new Date()
    };
    
    return this.updateTask(updatedTask);
  }
}