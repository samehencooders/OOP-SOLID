import { Injectable } from "@angular/core"
import type { SalesData, ChartData } from "../models/analytics.model"

@Injectable()
export class DataTransformService {
  constructor() {}

  /**
   * Transforms sales data into chart data for time series visualization
   */
  transformSalesDataToTimeSeriesChart(salesData: SalesData[]): ChartData {
    // Group sales by date using array methods
    const salesByDate = salesData.reduce(
      (acc, sale) => {
        const dateStr = sale.date.toISOString().split("T")[0]
        if (!acc[dateStr]) {
          acc[dateStr] = 0
        }
        acc[dateStr] += sale.amount
        return acc
      },
      {} as Record<string, number>,
    )

    // Sort dates
    const sortedDates = Object.keys(salesByDate).sort()

    return {
      labels: sortedDates.map((date) => new Date(date).toLocaleDateString()),
      datasets: [
        {
          label: "Sales Amount",
          data: sortedDates.map((date) => salesByDate[date]),
          borderColor: "#3f51b5",
          borderWidth: 2,
          fill: false,
        },
      ],
    }
  }

  /**
   * Transforms sales data into chart data for category comparison
   */
  transformSalesDataToCategoryChart(salesData: SalesData[]): ChartData {
    // Group sales by category using array methods
    const salesByCategory = salesData.reduce(
      (acc, sale) => {
        if (!acc[sale.category]) {
          acc[sale.category] = 0
        }
        acc[sale.category] += sale.amount
        return acc
      },
      {} as Record<string, number>,
    )

    const categories = Object.keys(salesByCategory)
    const backgroundColors = [
      "#3f51b5",
      "#f44336",
      "#4caf50",
      "#ff9800",
      "#9c27b0",
      "#2196f3",
      "#ff5722",
      "#009688",
      "#673ab7",
      "#e91e63",
    ]

    return {
      labels: categories,
      datasets: [
        {
          label: "Sales by Category",
          data: categories.map((category) => salesByCategory[category]),
          backgroundColor: backgroundColors.slice(0, categories.length),
        },
      ],
    }
  }

  /**
   * Transforms sales data into chart data for regional comparison
   */
  transformSalesDataToRegionChart(salesData: SalesData[]): ChartData {
    // Group sales by region using array methods
    const salesByRegion = salesData.reduce(
      (acc, sale) => {
        if (!acc[sale.region]) {
          acc[sale.region] = 0
        }
        acc[sale.region] += sale.amount
        return acc
      },
      {} as Record<string, number>,
    )

    const regions = Object.keys(salesByRegion)
    const backgroundColors = [
      "#3f51b5",
      "#f44336",
      "#4caf50",
      "#ff9800",
      "#9c27b0",
      "#2196f3",
      "#ff5722",
      "#009688",
      "#673ab7",
      "#e91e63",
    ]

    return {
      labels: regions,
      datasets: [
        {
          label: "Sales by Region",
          data: regions.map((region) => salesByRegion[region]),
          backgroundColor: backgroundColors.slice(0, regions.length),
        },
      ],
    }
  }

  /**
   * Calculates monthly growth rates
   */
  calculateMonthlyGrowth(salesData: SalesData[]): { month: string; growth: number }[] {
    // Group sales by month
    const salesByMonth = salesData.reduce(
      (acc, sale) => {
        const monthYear = `${sale.date.getMonth() + 1}/${sale.date.getFullYear()}`
        if (!acc[monthYear]) {
          acc[monthYear] = 0
        }
        acc[monthYear] += sale.amount
        return acc
      },
      {} as Record<string, number>,
    )

    // Sort months chronologically
    const sortedMonths = Object.keys(salesByMonth).sort((a, b) => {
      const [aMonth, aYear] = a.split("/").map(Number)
      const [bMonth, bYear] = b.split("/").map(Number)
      if (aYear !== bYear) return aYear - bYear
      return aMonth - bMonth
    })

    // Calculate growth rates
    const growthRates = sortedMonths.map((month, index) => {
      if (index === 0) return { month, growth: 0 }

      const currentSales = salesByMonth[month]
      const previousSales = salesByMonth[sortedMonths[index - 1]]
      const growth = previousSales > 0 ? ((currentSales - previousSales) / previousSales) * 100 : 0

      return { month, growth }
    })

    return growthRates.slice(1) // Skip the first month as it has no growth rate
  }

  /**
   * Groups sales data by a specific property
   */
  groupSalesDataBy(salesData: SalesData[], property: keyof SalesData): Record<string, number> {
    return salesData.reduce(
      (acc, sale) => {
        const key = String(sale[property])
        if (!acc[key]) {
          acc[key] = 0
        }
        acc[key] += sale.amount
        return acc
      },
      {} as Record<string, number>,
    )
  }

  /**
   * Calculates the top performing items by a specific property
   */
  getTopPerformers(salesData: SalesData[], property: keyof SalesData, limit = 5): { name: string; value: number }[] {
    const grouped = this.groupSalesDataBy(salesData, property)

    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, limit)
  }
}
