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

  private handleError(error: any) {
    console.error(`err:`, error);
    return throwError(() => new Error(`erroper catched:${error}`));
  }
}
