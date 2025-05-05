
import { Component,  OnInit } from "@angular/core"
import  { Router } from "@angular/router"
import  { Observable } from "rxjs"
import { Workflow } from "src/app/models/workflow.model"
import { AnalyticsService } from "src/app/services/analytics.service"
import { GamificationService } from "src/app/services/gamification.service"
import { WorkflowService } from "src/app/services/workflow.service"


@Component({
  selector: "app-task-planner-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class TaskPlannerDashboardComponent implements OnInit {
  workflows$: Observable<Workflow[]>
  userXp$: Observable<number>
  userLevel$: Observable<number>

  // Analytics summary data
  analyticsSummary: {
    totalTasks: number
    completedTasks: number
    avgCycleTime: number
    riskTasks: number
  } = {
    totalTasks: 0,
    completedTasks: 0,
    avgCycleTime: 0,
    riskTasks: 0,
  }

  constructor(
    private workflowService: WorkflowService,
    private analyticsService: AnalyticsService,
    private gamificationService: GamificationService,
    private router: Router,
  ) {
    this.workflows$ = this.workflowService.workflows$
    this.userXp$ = this.gamificationService.userXp$
    this.userLevel$ = this.gamificationService.userLevel$
  }

  ngOnInit(): void {
    // Load workflows
    this.workflowService.getWorkflows().subscribe()

    // Load analytics summary for the first workflow (if any)
    this.workflows$.subscribe((workflows) => {
      if (workflows.length > 0) {
        this.loadAnalyticsSummary(workflows[0].id)
      }
    })
  }

  loadAnalyticsSummary(workflowId: string): void {
    this.analyticsService.getTaskDistribution(workflowId).subscribe((distribution) => {
      this.analyticsSummary.totalTasks = Object.values(distribution).reduce((sum, count) => sum + count, 0)
    })

    this.analyticsService.getCycleTimeMetrics(workflowId).subscribe((metrics) => {
      this.analyticsSummary.avgCycleTime = metrics.average
    })

    this.analyticsService.getRiskPredictions(workflowId).subscribe((predictions) => {
      this.analyticsSummary.riskTasks = predictions.filter((p) => p.probability > 0.7).length
    })
  }

  navigateToWorkflow(workflowId: string): void {
    this.router.navigate(["/task-planner/board"], { queryParams: { workflow: workflowId } })
  }
}
