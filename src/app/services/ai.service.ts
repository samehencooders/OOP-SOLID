import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import {  Observable, throwError } from "rxjs"
import { catchError } from "rxjs/operators"
import  { Task } from "../models/task.model"
import  { Workflow } from "../models/workflow.model"
import { environment } from "src/environments/environment"

@Injectable({
  providedIn: "root",
})
export class AiService {
  private apiUrl = `${environment.apiUrl}/ai`

  constructor(private http: HttpClient) {}

  // Process natural language input to create a task
  processNaturalLanguageTask(input: string): Observable<Partial<Task>> {
    return this.http.post<Partial<Task>>(`${this.apiUrl}/process-task`, { input }).pipe(catchError(this.handleError))
  }

  // Generate workflow template based on project type
  generateWorkflowTemplate(projectType: string): Observable<Workflow> {
    return this.http
      .post<Workflow>(`${this.apiUrl}/generate-workflow`, { projectType })
      .pipe(catchError(this.handleError))
  }

  // Predict task completion time
  predictTaskCompletionTime(taskId: string): Observable<{
    predictedDays: number
    confidence: number
    factors: Array<{ factor: string; impact: number }>
  }> {
    return this.http.get<any>(`${this.apiUrl}/predict-completion/${taskId}`).pipe(catchError(this.handleError))
  }

  // Suggest optimal assignee for a task
  suggestAssignee(taskId: string): Observable<{
    userId: string
    confidence: number
    reasoning: string
  }> {
    return this.http.get<any>(`${this.apiUrl}/suggest-assignee/${taskId}`).pipe(catchError(this.handleError))
  }

  // Generate checklist items for a task
  generateChecklist(taskId: string): Observable<Array<{ content: string; confidence: number }>> {
    return this.http.get<any>(`${this.apiUrl}/generate-checklist/${taskId}`).pipe(catchError(this.handleError))
  }

  // Analyze workflow for bottlenecks
  analyzeWorkflowBottlenecks(workflowId: string): Observable<
    Array<{
      stageId: string
      severity: number
      reason: string
      recommendation: string
    }>
  > {
    return this.http.get<any>(`${this.apiUrl}/analyze-bottlenecks/${workflowId}`).pipe(catchError(this.handleError))
  }

  // Suggest optimal WIP limits
  suggestWipLimits(workflowId: string): Observable<
    Record<
      string,
      {
        recommendedLimit: number
        currentLimit: number | null
        reasoning: string
      }
    >
  > {
    return this.http.get<any>(`${this.apiUrl}/suggest-wip-limits/${workflowId}`).pipe(catchError(this.handleError))
  }

  // Analyze task risk
  analyzeTaskRisk(taskId: string): Observable<{
    riskScore: number
    factors: Array<{ factor: string; impact: number; description: string }>
    mitigationSuggestions: string[]
  }> {
    return this.http.get<any>(`${this.apiUrl}/analyze-risk/${taskId}`).pipe(catchError(this.handleError))
  }

  // Generate summary of project status
  generateProjectSummary(workflowId: string): Observable<{
    summary: string
    keyMetrics: Record<string, number>
    risks: Array<{ description: string; severity: number }>
    recommendations: string[]
  }> {
    return this.http.get<any>(`${this.apiUrl}/project-summary/${workflowId}`).pipe(catchError(this.handleError))
  }

  // Handle API errors
  private handleError(error: any) {
    console.error("AI API error:", error)
    return throwError(() => new Error(error.message || "Unknown error occurred"))
  }
}
