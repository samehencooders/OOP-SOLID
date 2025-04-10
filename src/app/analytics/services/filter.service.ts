import { Injectable } from "@angular/core"
import type { SalesData, FilterCriteria } from "../models/analytics.model"

@Injectable()
export class FilterService {
  constructor() {}

  filterSalesData(salesData: SalesData[], criteria: FilterCriteria): SalesData[] {
    return salesData.filter((sale) => {
      // Filter by date range
      if (criteria.dateRange?.start && sale.date < criteria.dateRange.start) {
        return false
      }
      if (criteria.dateRange?.end) {
        const endDate = new Date(criteria.dateRange.end)
        endDate.setHours(23, 59, 59, 999) // End of day
        if (sale.date > endDate) {
          return false
        }
      }

      // Filter by categories
      if (criteria.categories?.length && !criteria.categories.includes(sale.category)) {
        return false
      }

      // Filter by regions
      if (criteria.regions?.length && !criteria.regions.includes(sale.region)) {
        return false
      }

      // Filter by status
      if (criteria.status?.length && !criteria.status.includes(sale.status)) {
        return false
      }

      // Filter by amount range
      if (criteria.minAmount !== undefined && sale.amount < criteria.minAmount) {
        return false
      }
      if (criteria.maxAmount !== undefined && sale.amount > criteria.maxAmount) {
        return false
      }

      // Filter by search term
      if (criteria.searchTerm) {
        const searchLower = criteria.searchTerm.toLowerCase()
        const searchableFields = [
          sale.product.toLowerCase(),
          sale.category.toLowerCase(),
          sale.region.toLowerCase(),
          sale.customer.toLowerCase(),
          sale.paymentMethod.toLowerCase(),
        ]
        if (!searchableFields.some((field) => field.includes(searchLower))) {
          return false
        }
      }

      return true
    })
  }

  getUniqueValues(salesData: SalesData[], property: keyof SalesData): string[] {
    // Use Set to get unique values
    const uniqueValues = new Set(salesData.map((sale) => String(sale[property])))
    return Array.from(uniqueValues).sort()
  }

  getDateRange(salesData: SalesData[]): { min: Date; max: Date } {
    if (!salesData.length) {
      const now = new Date()
      return { min: now, max: now }
    }

    // Use reduce to find min and max dates
    return salesData.reduce(
      (range, sale) => {
        if (sale.date < range.min) range.min = sale.date
        if (sale.date > range.max) range.max = sale.date
        return range
      },
      { min: new Date(8640000000000000), max: new Date(-8640000000000000) },
    )
  }

  getAmountRange(salesData: SalesData[]): { min: number; max: number } {
    if (!salesData.length) {
      return { min: 0, max: 0 }
    }

    // Use reduce to find min and max amounts
    return salesData.reduce(
      (range, sale) => {
        if (sale.amount < range.min) range.min = sale.amount
        if (sale.amount > range.max) range.max = sale.amount
        return range
      },
      { min: Number.MAX_VALUE, max: Number.MIN_VALUE },
    )
  }
}
