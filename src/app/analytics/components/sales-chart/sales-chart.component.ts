import { Component, Input, type OnChanges, type SimpleChanges } from "@angular/core"
import type { ChartData } from "../../models/analytics.model"
import type { ChartConfiguration, ChartType } from "chart.js"

@Component({
  selector: "app-sales-chart",
  templateUrl: "./sales-chart.component.html",
  styleUrls: ["./sales-chart.component.scss"],
})
export class SalesChartComponent implements OnChanges {
  @Input() chartData: ChartData | null = null
  @Input() chartType: ChartType = "line"

  chartOptions: ChartConfiguration["options"] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
  }

  chartConfiguration: ChartConfiguration = {
    type: this.chartType,
    data: {
      labels: [],
      datasets: [],
    },
    options: this.chartOptions,
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["chartData"] && this.chartData) {
      this.updateChartConfiguration()
    }

    if (changes["chartType"]) {
      this.chartConfiguration.type = this.chartType
    }
  }

  private updateChartConfiguration(): void {
    if (!this.chartData) return

    this.chartConfiguration.data = {
      labels: this.chartData.labels,
      datasets: this.chartData.datasets,
    }

    // Customize options based on chart type
    if (this.chartType === "line") {
      this.chartOptions = {
        ...this.chartOptions,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      }
    } else if (this.chartType === "doughnut" || this.chartType === "pie") {
      this.chartOptions = {
        ...this.chartOptions,
        plugins: {
          ...this.chartOptions?.plugins,
          tooltip: {
            callbacks: {
              label: (context: any) => {
                const label = context.label || ""
                const value = context.raw || 0
                const total = context.chart.data.datasets[0].data.reduce((a: number, b: number) => a + b, 0)
                const percentage = Math.round((value / total) * 100)
                return `${label}: $${value} (${percentage}%)`
              },
            },
          },
        },
      }
    }

    this.chartConfiguration.options = this.chartOptions
  }
}
