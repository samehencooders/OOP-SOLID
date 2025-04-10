export interface SalesData {
  id: string
  date: Date
  amount: number
  product: string
  category: string
  region: string
  customer: string
  paymentMethod: string
  status: "completed" | "pending" | "refunded"
}

export interface PerformanceMetric {
  id: string
  name: string
  value: number
  previousValue: number
  unit: string
  trend: "up" | "down" | "stable"
  percentageChange: number
}

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string[]
    borderColor?: string
    borderWidth?: number
    fill?: boolean
  }[]
}

export interface FilterCriteria {
  dateRange?: {
    start: Date | null
    end: Date | null
  }
  categories?: string[]
  regions?: string[]
  status?: string[]
  minAmount?: number
  maxAmount?: number
  searchTerm?: string
}

export interface AnalyticsSummary {
  totalSales: number
  averageSale: number
  salesCount: number
  topProduct: string
  topCategory: string
  topRegion: string
}
