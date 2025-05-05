import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  TransitionRule,
  Workflow,
  WorkflowStage,
} from '../models/workflow.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class WorkflowService {
  private apiUrl = `${environment.apiUrl}`;
  private workflowsSubject = new BehaviorSubject<Workflow[]>([]);
  private currentWorkflowSubject = new BehaviorSubject<Workflow | null>(null);
  public workflows$ = this.workflowsSubject.asObservable();
  public currentWorkflow$ = this.currentWorkflowSubject.asObservable();

  constructor(private http: HttpClient) {}

  getWorkflows(): Observable<Workflow[]> {
    return this.http.get<Workflow[]>(`${this.apiUrl}/workflows`).pipe(
      tap((workflows) => this.workflowsSubject.next(workflows)),
      catchError(this.handleError)
    );
  }
  getWorkflowTemplates(): Observable<Workflow[]> {
    return this.http
      .get<Workflow[]>(`${this.apiUrl}/templates`)
      .pipe(catchError(this.handleError));
  }

  getWorkflowById(workflowId: string): Observable<Workflow> {
    return this.http.get<Workflow>(`${this.apiUrl}/${workflowId}`).pipe(
      tap((workflow) => this.currentWorkflowSubject.next(workflow)),
      catchError(this.handleError)
    );
  }

  createWorkflow(workflow: Partial<Workflow>): Observable<Workflow> {
    return this.http.post<Workflow>(this.apiUrl, workflow).pipe(
      tap((workflow) => {
        const currentWorkflows = this.workflowsSubject.getValue();
        this.workflowsSubject.next([...currentWorkflows, workflow]);
      }),
      catchError(this.handleError)
    );
  }
  updateWorkflow(
    workflowId: string,
    updates: Partial<Workflow>
  ): Observable<Workflow> {
    return this.http
      .patch<Workflow>(`${this.apiUrl}/${workflowId}`, updates)
      .pipe(
        tap((updatedWorkflow) => {
          const currentWorkflows = this.workflowsSubject.getValue();
          const index = currentWorkflows.findIndex((x) => x.id === workflowId);
          if (index !== -1) {
            const updatedWorkflows = [...currentWorkflows];
            updatedWorkflows[index] = updatedWorkflow;
            this.workflowsSubject.next(updatedWorkflows);
          }
          if (this.currentWorkflowSubject.getValue()?.id === workflowId) {
            this.currentWorkflowSubject.next(updatedWorkflow);
          }
        }),
        catchError(this.handleError)
      );
  }
  deleteWorkflow(workflowId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${workflowId}`).pipe(
      tap(() => {
        const currentWorkflows = this.workflowsSubject.getValue();
        this.workflowsSubject.next(
          currentWorkflows.filter((x) => x.id !== workflowId)
        );

        if (this.currentWorkflowSubject.getValue()?.id === workflowId) {
          this.currentWorkflowSubject.next(null);
        }
      }),
      catchError(this.handleError)
    );
  }

  addStage(
    workflowId: string,
    stage: Partial<WorkflowStage>
  ): Observable<WorkflowStage> {
    return this.http
      .post<WorkflowStage>(`${this.apiUrl}/${workflowId}/stages`, stage)
      .pipe(
        tap((newStage) => {
          const currentWorkflow = this.currentWorkflowSubject.getValue();
          if (currentWorkflow && currentWorkflow.id === workflowId) {
            const updatedWorkflow = {
              ...currentWorkflow,
              stages: [...currentWorkflow.stages, newStage],
            };
            this.currentWorkflowSubject.next(updatedWorkflow);
            const currentWorkflows = this.workflowsSubject.getValue();
            const index = currentWorkflows.findIndex(
              (x) => x.id === workflowId
            );
            if (index !== -1) {
              const updatedWorkflows = [...currentWorkflows];
              updatedWorkflows[index] = updatedWorkflow;
              this.workflowsSubject.next(updatedWorkflows);
            }
          }
        }),
        catchError(this.handleError)
      );
  }
  updateStage(
    workflowId: string,
    stageId: string,
    updates: Partial<WorkflowStage>
  ): Observable<WorkflowStage> {
    return this.http
      .patch<WorkflowStage>(
        `${this.apiUrl}/${workflowId}/stages/${stageId}`,
        updates
      )
      .pipe(
        tap((updatedStage) => {
          const currentWorkFlow = this.currentWorkflowSubject.getValue();
          if (currentWorkFlow && currentWorkFlow.id === workflowId) {
            const stageIndex = currentWorkFlow.stages.findIndex(
              (x) => x.id === stageId
            );
            if (stageIndex !== -1) {
              const updatedStages = [...currentWorkFlow.stages];
              updatedStages[stageIndex] = updatedStage;
              const updatedWorkflow = {
                ...currentWorkFlow,
                stages: updatedStages,
              };
              this.currentWorkflowSubject.next(updatedWorkflow);
              const currentWorkflows = this.workflowsSubject.getValue();
              const workflowIndex = currentWorkflows.findIndex(
                (x) => x.id === workflowId
              );
              if (workflowIndex !== -1) {
                const updatedWorkflows = [...currentWorkflows];
                updatedWorkflows[workflowIndex] = updatedWorkflow;
                this.workflowsSubject.next(updatedWorkflows);
              }
            }
          }
        }),
        catchError(this.handleError)
      );
  }
  deleteStage(workflowId: string, stageId: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${workflowId}/stages/${stageId}`)
      .pipe(
        tap(() => {
          const currentWorkflow = this.currentWorkflowSubject.getValue();
          if (currentWorkflow && currentWorkflow.id === workflowId) {
            const updatedWorkflow = {
              ...currentWorkflow,
              stages: currentWorkflow.stages.filter((x) => x.id !== stageId),
            };
            this.currentWorkflowSubject.next(updatedWorkflow);
            const currentWorkflows = this.workflowsSubject.getValue();
            const workflowIndex = currentWorkflows.findIndex(
              (x) => x.id === workflowId
            );
            if (workflowIndex !== -1) {
              const updatedWorkflows = [...currentWorkflows];
              updatedWorkflows[workflowIndex] = updatedWorkflow;
              this.workflowsSubject.next(updatedWorkflows);
            }
          }
        }),
        catchError(this.handleError)
      );
  }
  addTransitionRule(
    workflowId: string,
    stageId: string,
    rule: Partial<TransitionRule>
  ): Observable<TransitionRule> {
    return this.http
      .post<TransitionRule>(
        `${this.apiUrl}/${workflowId}/stages/${stageId}/rules`,
        rule
      )
      .pipe(
        tap(() => {
          this.getWorkflowById(workflowId).subscribe();
        }),
        catchError(this.handleError)
      );
  }
  updateTransitionRule(
    workflowId: string,
    stageId: string,
    ruleId: string,
    update: Partial<TransitionRule>
  ): Observable<TransitionRule> {
    return this.http
      .patch<TransitionRule>(
        `${this.apiUrl}/${workflowId}/stages/${stageId}/rules/${ruleId}`,
        update
      )
      .pipe(
        tap(() => {
          this.getWorkflowById(workflowId).subscribe();
        }),
        catchError(this.handleError)
      );
  }
  deleteTransitionRule(
    workflowId: string,
    stageId: string,
    ruleId: string
  ): Observable<void> {
    return this.http
      .delete<void>(
        `${this.apiUrl}/${workflowId}/stages/${stageId}/rules/${ruleId}`
      )
      .pipe(
        tap(() => {
          this.getWorkflowById(workflowId).subscribe();
        }),
        catchError(this.handleError)
      );
  }
  generateAiWorkflowTemplate(projectType: string): Observable<Workflow> {
    return this.http
      .post<Workflow>(`${this.apiUrl}/ai-template`, { projectType })
      .pipe(catchError(this.handleError));
  }
  getOptimalWipLimits(workflowId: string): Observable<Record<string, number>> {
    return this.http
      .get<Record<string, number>>(`${this.apiUrl}/${workflowId}/wip-limits`)
      .pipe(
        tap(() => this.getWorkflowById(workflowId).subscribe()),
        catchError(this.handleError)
      );
  }
  private handleError(error: any) {
    console.error(`Api Error:`, error);
    return throwError(
      () => new Error(error.message || 'unexpecteed error occured')
    );
  }
}
