import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import {  Observable, throwError } from "rxjs"
import { catchError } from "rxjs/operators"
import  {
  AnalyticsData,
  CycleTimeMetrics,
  LeadTimeMetrics,
  FlowEfficiencyMetrics,
  CapacityMetrics,
  RiskPrediction,
  BottleneckData,
  CumulativeFlowData,
  TimeSeriesData,
} from "../models/analytics.model"
import { environment } from "src/environments/environment"

@Injectable({
  providedIn: "root",
})
export class AnalyticsService {
  private apiUrl = `${environment.apiUrl}`

  constructor(private http: HttpClient) {}

  // Get all analytics data for a workflow
  getAnalyticsForWorkflow(workflowId: string): Observable<AnalyticsData> {
    return this.http.get<AnalyticsData>(`${this.apiUrl}/workflow/${workflowId}`).pipe(catchError(this.handleError))
  }

  // Get cycle time metrics
  getCycleTimeMetrics(workflowId: string, timeframe = "30d"): Observable<CycleTimeMetrics> {
    return this.http
      .get<CycleTimeMetrics>(`${this.apiUrl}/workflow/${workflowId}/cycle-time?timeframe=${timeframe}`)
      .pipe(catchError(this.handleError))
  }

  // Get lead time metrics
  getLeadTimeMetrics(workflowId: string, timeframe = "30d"): Observable<LeadTimeMetrics> {
    return this.http
      .get<LeadTimeMetrics>(`${this.apiUrl}/workflow/${workflowId}/lead-time?timeframe=${timeframe}`)
      .pipe(catchError(this.handleError))
  }

  // Get flow efficiency metrics
  getFlowEfficiencyMetrics(workflowId: string, timeframe = "30d"): Observable<FlowEfficiencyMetrics> {
    return this.http
      .get<FlowEfficiencyMetrics>(`${this.apiUrl}/workflow/${workflowId}/flow-efficiency?timeframe=${timeframe}`)
      .pipe(catchError(this.handleError))
  }

  // Get team capacity metrics
  getCapacityMetrics(workflowId: string): Observable<CapacityMetrics> {
    return this.http
      .get<CapacityMetrics>(`${this.apiUrl}/workflow/${workflowId}/capacity`)
      .pipe(catchError(this.handleError))
  }

  // Get risk predictions for tasks
  getRiskPredictions(workflowId: string): Observable<RiskPrediction[]> {
    return this.http
      .get<RiskPrediction[]>(`${this.apiUrl}/workflow/${workflowId}/risk-predictions`)
      .pipe(catchError(this.handleError))
  }

  // Get bottleneck data
  getBottleneckData(workflowId: string): Observable<BottleneckData[]> {
    return this.http
      .get<BottleneckData[]>(`${this.apiUrl}/workflow/${workflowId}/bottlenecks`)
      .pipe(catchError(this.handleError))
  }

  // Get cumulative flow data
  getCumulativeFlowData(workflowId: string, timeframe = "30d"): Observable<CumulativeFlowData[]> {
    return this.http
      .get<CumulativeFlowData[]>(`${this.apiUrl}/workflow/${workflowId}/cumulative-flow?timeframe=${timeframe}`)
      .pipe(catchError(this.handleError))
  }

  // Get time series data for a specific metric
  getTimeSeriesData(workflowId: string, metric: string, timeframe = "30d"): Observable<TimeSeriesData[]> {
    return this.http
      .get<TimeSeriesData[]>(`${this.apiUrl}/workflow/${workflowId}/time-series/${metric}?timeframe=${timeframe}`)
      .pipe(catchError(this.handleError))
  }

  // Get task distribution by stage
  getTaskDistribution(workflowId: string): Observable<Record<string, number>> {
    return this.http
      .get<Record<string, number>>(`${this.apiUrl}/${workflowId}/task-distribution`)
      .pipe(catchError(this.handleError))
  }

  // Get task aging report (tasks that have been in a stage for too long)
  getTaskAgingReport(workflowId: string): Observable<
    Array<{
      taskId: string
      stageId: string
      daysInStage: number
      priority: string
      riskScore: number
    }>
  > {
    return this.http.get<any>(`${this.apiUrl}/workflow/${workflowId}/task-aging`).pipe(catchError(this.handleError))
  }

  // Get team performance metrics
  getTeamPerformanceMetrics(
    teamId: string,
    timeframe = "30d",
  ): Observable<{
    tasksCompleted: number
    avgCycleTime: number
    flowEfficiency: number
    capacityUtilization: number
    memberPerformance: Record<
      string,
      {
        tasksCompleted: number
        avgCycleTime: number
      }
    >
  }> {
    return this.http
      .get<any>(`${this.apiUrl}/team/${teamId}/performance?timeframe=${timeframe}`)
      .pipe(catchError(this.handleError))
  }

  // Export analytics data
  exportAnalyticsData(workflowId: string, format: "csv" | "json" | "pdf"): Observable<Blob> {
    return this.http
      .get(`${this.apiUrl}/workflow/${workflowId}/export?format=${format}`, {
        responseType: "blob",
      })
      .pipe(catchError(this.handleError))
  }

  // Handle API errors
  private handleError(error: any) {
    console.error("Analytics API error:", error)
    return throwError(() => new Error(error.message || "Unknown error occurred"))
  }
}
