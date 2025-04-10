import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { ReactiveFormsModule } from "@angular/forms"

// Material imports
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatTableModule } from "@angular/material/table"
import { MatSortModule } from "@angular/material/sort"
import { MatPaginatorModule } from "@angular/material/paginator"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatSelectModule } from "@angular/material/select"
import { MatDatepickerModule } from "@angular/material/datepicker"
import { MatNativeDateModule } from "@angular/material/core"
import { MatTabsModule } from "@angular/material/tabs"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"

// Components
import { AnalyticsDashboardComponent } from "./containers/analytics-dashboard/analytics-dashboard.component"
import { SalesChartComponent } from "./components/sales-chart/sales-chart.component"
import { PerformanceMetricsComponent } from "./components/performance-metrics/performance-metrics.component"
import { DataTableComponent } from "./components/data-table/data-table.component"
import { FilterPanelComponent } from "./components/filter-panel/filter-panel.component"
import { MetricCardComponent } from "./components/metric-card/metric-card.component"

// Services
import { AnalyticsService } from "./services/analytics.service"
import { DataTransformService } from "./services/data-transform.service"
import { FilterService } from "./services/filter.service"

// NgCharts
// import { NgChartsModule } from "ng2-charts"

const routes = [{ path: "", component: AnalyticsDashboardComponent }]

@NgModule({
  declarations: [
    AnalyticsDashboardComponent,
    SalesChartComponent,
    PerformanceMetricsComponent,
    DataTableComponent,
    FilterPanelComponent,
    MetricCardComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    // NgChartsModule,
  ],
  providers: [AnalyticsService, DataTransformService, FilterService],
})
export class AnalyticsModule {}
