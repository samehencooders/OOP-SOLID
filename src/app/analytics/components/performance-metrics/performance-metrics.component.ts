import { Component, Input } from "@angular/core"
import type { PerformanceMetric } from "../../models/analytics.model"

@Component({
  selector: "app-performance-metrics",
  templateUrl: "./performance-metrics.component.html",
  styleUrls: ["./performance-metrics.component.scss"],
})
export class PerformanceMetricsComponent {
  @Input() metrics: PerformanceMetric[] | null = null

  getChangeClass(trend: string): string {
    switch (trend) {
      case "up":
        return "positive-change"
      case "down":
        return "negative-change"
      default:
        return "neutral-change"
    }
  }

  getChangeIcon(trend: string): string {
    switch (trend) {
      case "up":
        return "trending_up"
      case "down":
        return "trending_down"
      default:
        return "trending_flat"
    }
  }
}
