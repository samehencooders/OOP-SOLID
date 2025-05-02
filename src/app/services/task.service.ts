import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  Observable,
  of,
  tap,
  throwError,
} from 'rxjs';
import { Task } from '../models/task.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/tasks`;
  private taskSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.taskSubject.asObservable();
  constructor(private http: HttpClient) {}
  getTaskByWorkflow(workflowId: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/workflow/${workflowId}`).pipe(
      tap((tasks) => {
        this.taskSubject.next(tasks);
      }),
      catchError((err) => this.handleError(err))
    );
  }
  getTaskById(taskId: string): Observable<Task> {
    return this.http
      .get<Task>(`${this.apiUrl}/${taskId}`)
      .pipe(catchError((err) => this.handleError(err)));
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task).pipe(
      tap((newTask) => {
        const currentTasks = this.taskSubject.getValue();
        this.taskSubject.next([...currentTasks, newTask]);
      }),
      catchError((err) => this.handleError(err))
    );
  }

  updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${task.id}`, task).pipe(
      tap((newTask) => {
        const currentTasks = this.taskSubject.getValue();
        const index = currentTasks.findIndex((x) => x.id === newTask.id);
        if (index !== -1) {
          const uptaedTasks = [...currentTasks];
          uptaedTasks[index] = newTask;
          this.taskSubject.next(uptaedTasks);
        }
      }),
      catchError((err) => this.handleError(err))
    );
  }
  private handleError(error: any) {
    console.error(`err:`, error);
    return throwError(() => new Error(`erroper catched:${error}`));
  }
}
