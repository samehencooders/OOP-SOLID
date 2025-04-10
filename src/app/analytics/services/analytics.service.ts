import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import { type Observable, of, throwError } from "rxjs"
import { catchError, map, shareReplay } from "rxjs/operators"
import type { SalesData, PerformanceMetric, AnalyticsSummary } from "../models/analytics.model"

@Injectable()
export class AnalyticsService {
  private apiUrl = "api/analytics" // Replace with your actual API endpoint
  private cachedSalesData$: Observable<SalesData[]> | null = null
  private cachedPerformanceMetrics$: Observable<PerformanceMetric[]> | null = null

  constructor(private http: HttpClient) {}

  getSalesData(): Observable<SalesData[]> {
    if (!this.cachedSalesData$) {
      this.cachedSalesData$ = this.http.get<SalesData[]>(`${this.apiUrl}/sales`).pipe(
        map((data) => this.transformSalesData(data)),
        shareReplay(1),
        catchError(this.handleError),
      )
    }
    return this.cachedSalesData$
  }

  getPerformanceMetrics(): Observable<PerformanceMetric[]> {
    if (!this.cachedPerformanceMetrics$) {
      this.cachedPerformanceMetrics$ = this.http
        .get<PerformanceMetric[]>(`${this.apiUrl}/metrics`)
        .pipe(shareReplay(1), catchError(this.handleError))
    }
    return this.cachedPerformanceMetrics$
  }

  getAnalyticsSummary(salesData: SalesData[]): AnalyticsSummary {
    // Calculate summary using array methods
    const totalSales = salesData.reduce((sum, sale) => sum + sale.amount, 0)
    const salesCount = salesData.length
    const averageSale = salesCount > 0 ? totalSales / salesCount : 0

    // Find top product using array methods
    const productCounts = salesData.reduce(
      (acc, sale) => {
        acc[sale.product] = (acc[sale.product] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const topProduct =
      Object.entries(productCounts)
        .sort((a, b) => b[1] - a[1])
        .map((entry) => entry[0])[0] || ""

    // Find top category using array methods
    const categoryCounts = salesData.reduce(
      (acc, sale) => {
        acc[sale.category] = (acc[sale.category] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const topCategory =
      Object.entries(categoryCounts)
        .sort((a, b) => b[1] - a[1])
        .map((entry) => entry[0])[0] || ""

    // Find top region using array methods
    const regionCounts = salesData.reduce(
      (acc, sale) => {
        acc[sale.region] = (acc[sale.region] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const topRegion =
      Object.entries(regionCounts)
        .sort((a, b) => b[1] - a[1])
        .map((entry) => entry[0])[0] || ""

    return {
      totalSales,
      averageSale,
      salesCount,
      topProduct,
      topCategory,
      topRegion,
    }
  }

  refreshData(): void {
    this.cachedSalesData$ = null
    this.cachedPerformanceMetrics$ = null
  }

  private transformSalesData(data: any[]): SalesData[] {
    return data.map((item) => ({
      ...item,
      date: new Date(item.date),
    }))
  }

  private handleError(error: any): Observable<never> {
    console.error("An error occurred:", error)
    return throwError(() => new Error("Something went wrong. Please try again later."))
  }

  // For demo purposes - remove in production
  getMockSalesData(): Observable<SalesData[]> {
    const mockData = this.generateMockSalesData()
    return of(mockData)
  }

  getMockPerformanceMetrics(): Observable<PerformanceMetric[]> {
    const mockMetrics = this.generateMockPerformanceMetrics()
    return of(mockMetrics)
  }

  private generateMockSalesData(): SalesData[] {
    const products = ["Laptop", "Smartphone", "Tablet", "Monitor", "Keyboard", "Mouse", "Headphones"]
    const categories = ["Electronics", "Accessories", "Peripherals"]
    const regions = ["North", "South", "East", "West", "Central"]
    const customers = ["John Doe", "Jane Smith", "Bob Johnson", "Alice Brown", "Charlie Wilson"]
    const paymentMethods = ["Credit Card", "PayPal", "Bank Transfer", "Cash"]
    const statuses = ["completed", "pending", "refunded"] as const

    return Array.from({ length: 100 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - Math.floor(Math.random() * 90)) // Random date within last 90 days

      return {
        id: `sale-${i + 1}`,
        date,
        amount: Math.floor(Math.random() * 1000) + 50,
        product: products[Math.floor(Math.random() * products.length)],
        category: categories[Math.floor(Math.random() * categories.length)],
        region: regions[Math.floor(Math.random() * regions.length)],
        customer: customers[Math.floor(Math.random() * customers.length)],
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
      }
    })
  }

  private generateMockPerformanceMetrics(): PerformanceMetric[] {
    const metrics = [
      { name: "Revenue", unit: "$", previousValue: 45000 },
      { name: "Orders", unit: "", previousValue: 1250 },
      { name: "Average Order Value", unit: "$", previousValue: 36 },
      { name: "Conversion Rate", unit: "%", previousValue: 3.2 },
    ]

    return metrics.map((metric, index) => {
      const value = metric.previousValue * (1 + (Math.random() * 0.4 - 0.2)) // -20% to +20% change
      const percentageChange = ((value - metric.previousValue) / metric.previousValue) * 100
      const trend = percentageChange > 0 ? "up" : percentageChange < 0 ? "down" : "stable"

      return {
        id: `metric-${index + 1}`,
        name: metric.name,
        value,
        previousValue: metric.previousValue,
        unit: metric.unit,
        trend,
        percentageChange,
      }
    })
  }
}
