import { Component, type OnInit, type OnDestroy } from "@angular/core"
import { Subject, type Observable, combineLatest } from "rxjs"
import { takeUntil, map, startWith, shareReplay } from "rxjs/operators"
import  { FormBuilder, FormGroup } from "@angular/forms"

import  { AnalyticsService } from "../../services/analytics.service"
import  { DataTransformService } from "../../services/data-transform.service"
import  { FilterService } from "../../services/filter.service"
import  {
  SalesData,
  PerformanceMetric,
  ChartData,
  FilterCriteria,
  AnalyticsSummary,
} from "../../models/analytics.model"

@Component({
  selector: "app-analytics-dashboard",
  templateUrl: "./analytics-dashboard.component.html",
  styleUrls: ["./analytics-dashboard.component.scss"],
})
export class AnalyticsDashboardComponent implements OnInit, OnDestroy {
  // Observables
  salesData$!: Observable<SalesData[]>
  filteredSalesData$!: Observable<SalesData[]>
  performanceMetrics$!: Observable<PerformanceMetric[]>
  timeSeriesChartData$!: Observable<ChartData>
  categoryChartData$!: Observable<ChartData>
  regionChartData$!: Observable<ChartData>
  analyticsSummary$!: Observable<AnalyticsSummary>

  // Filter form
  filterForm!: FormGroup
  categories: string[] = []
  regions: string[] = []
  statuses: string[] = ["completed", "pending", "refunded"]
  dateRange: { min: Date; max: Date } = { min: new Date(), max: new Date() }
  amountRange: { min: number; max: number } = { min: 0, max: 0 }

  // Loading state
  loading = true

  // Cleanup
  private destroy$ = new Subject<void>()

  constructor(
    private analyticsService: AnalyticsService,
    private dataTransformService: DataTransformService,
    private filterService: FilterService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.initFilterForm()
    this.loadData()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  private initFilterForm(): void {
    this.filterForm = this.fb.group({
      dateRange: this.fb.group({
        start: [null],
        end: [null],
      }),
      categories: [[]],
      regions: [[]],
      status: [[]],
      minAmount: [null],
      maxAmount: [null],
      searchTerm: [""],
    })
  }

  private loadData(): void {
    // Get sales data
    this.salesData$ = this.analyticsService.getMockSalesData().pipe(shareReplay(1))

    // Get performance metrics
    this.performanceMetrics$ = this.analyticsService.getMockPerformanceMetrics()

    // Initialize filter options
    this.salesData$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.categories = this.filterService.getUniqueValues(data, "category")
      this.regions = this.filterService.getUniqueValues(data, "region")
      this.dateRange = this.filterService.getDateRange(data)
      this.amountRange = this.filterService.getAmountRange(data)
      this.loading = false
    })

    // Create filtered data stream
    const filterCriteria$ = this.filterForm.valueChanges.pipe(startWith(this.filterForm.value as FilterCriteria))

    this.filteredSalesData$ = combineLatest([this.salesData$, filterCriteria$]).pipe(
      map(([data, criteria]) => this.filterService.filterSalesData(data, criteria)),
      shareReplay(1),
    )

    // Create derived data streams
    this.timeSeriesChartData$ = this.filteredSalesData$.pipe(
      map((data) => this.dataTransformService.transformSalesDataToTimeSeriesChart(data)),
    )

    this.categoryChartData$ = this.filteredSalesData$.pipe(
      map((data) => this.dataTransformService.transformSalesDataToCategoryChart(data)),
    )

    this.regionChartData$ = this.filteredSalesData$.pipe(
      map((data) => this.dataTransformService.transformSalesDataToRegionChart(data)),
    )

    this.analyticsSummary$ = this.filteredSalesData$.pipe(
      map((data) => this.analyticsService.getAnalyticsSummary(data)),
    )
  }

  refreshData(): void {
    this.loading = true
    this.analyticsService.refreshData()
    this.loadData()
  }

  resetFilters(): void {
    this.filterForm.reset({
      dateRange: {
        start: null,
        end: null,
      },
      categories: [],
      regions: [],
      status: [],
      minAmount: null,
      maxAmount: null,
      searchTerm: "",
    })
  }
}
