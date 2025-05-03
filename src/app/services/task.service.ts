import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  Observable,
  tap,
  throwError,
} from 'rxjs';
import { Task, Comment, Checklist, ChecklistItem } from '../models/task.model';
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

  updateTask(taskId: string, task: Partial<Task>): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${taskId}`, task).pipe(
      tap((updatedTask) => {
        const currentTasks = this.taskSubject.getValue();
        const index = currentTasks.findIndex((item) => item.id === taskId);
        if (index !== -1) {
          const newTasks = [...currentTasks];
          newTasks[index] = updatedTask;
          this.taskSubject.next(newTasks);
        }
      }),
      catchError(this.handleError)
    );
  }
  moveTask(taskId: string, targetStageId: string): Observable<Task> {
    return this.http
      .patch<Task>(`${this.apiUrl}/${taskId}/move`, {
        stageId: targetStageId,
      })
      .pipe(
        tap((updatedTask) => {
          const currentTasks = this.taskSubject.getValue();
          const index = currentTasks.findIndex((x) => x.id === taskId);
          if (index !== -1) {
            const updatedTasks = [...currentTasks];
            updatedTasks[index] = updatedTask;
            this.taskSubject.next(updatedTasks);
          }
        }),
        catchError(this.handleError)
      );
  }
  deleteTask(taskId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${taskId}`).pipe(
      tap(() => {
        const currentTasks = this.taskSubject.getValue();
        this.taskSubject.next(currentTasks.filter((x) => x.id !== taskId));
      }),
      catchError(this.handleError)
    );
  }

  addComment(taskId: string, comment: Partial<Comment>): Observable<Comment> {
    return this.http
      .post<Comment>(`${this.apiUrl}/${taskId}/comments`, comment)
      .pipe(
        tap((comment) => {
          const currentTasks = this.taskSubject.getValue();
          const index = currentTasks.findIndex((t) => t.id === taskId);
          if (index !== -1) {
            const newTasks = [...currentTasks];
            newTasks[index] = {
              ...newTasks[index],
              comments: [...newTasks[index].comments, comment],
            };
          }
        }),
        catchError(this.handleError)
      );
  }
  updateCheckList(
    taskId: string,
    checkList: Partial<Checklist>
  ): Observable<Checklist> {
    return this.http
      .put<Checklist>(
        `${this.apiUrl}/${taskId}/checklists/${checkList.id}`,
        checkList
      )
      .pipe(
        tap((updatedChecklist) => {
          const currentTasks = this.taskSubject.getValue();
          const index = currentTasks.findIndex((i) => i.id === taskId);
          if (index !== -1) {
            const updatedTaskes = [...currentTasks];
            const checklistIndex = updatedTaskes[index].checklists.findIndex(
              (x) => x.id === checkList.id
            );
            if (checklistIndex !== -1) {
              updatedTaskes[index].checklists[checklistIndex] =
                updatedChecklist;
              this.taskSubject.next(updatedTaskes);
            }
          }
        }),
        catchError(this.handleError)
      );
  }

  getAiSuggestedTasks(projectType: string): Observable<Partial<Task[]>> {
    return this.http
      .get<Partial<Task[]>>(
        `${this.apiUrl}/ai-suggessted?projectType=${projectType}`
      )
      .pipe(catchError(this.handleError));
  }
  getAiSuggesstedChecklist(
    taskId: string
  ): Observable<Partial<ChecklistItem[]>> {
    return this.http
      .get<Partial<ChecklistItem[]>>(`${this.apiUrl}/${taskId}/ai-checklist`)
      .pipe(catchError(this.handleError));
  }
  predictDeadline(
    taskId: string
  ): Observable<{ predictDate: Date; cofidence: number }> {
    return this.http
      .get<{ predictDate: Date; cofidence: number }>(
        `${this.apiUrl}/${taskId}/predict-deadline`
      )
      .pipe(catchError(this.handleError));
  }
  private handleError(error: any) {
    console.error(`err:`, error);
    return throwError(() => new Error(`erroper catched:${error}`));
  }
}
