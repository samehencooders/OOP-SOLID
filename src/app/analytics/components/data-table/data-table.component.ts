import { Component, Input, type OnChanges, type SimpleChanges, ViewChild } from "@angular/core"
import { MatTableDataSource } from "@angular/material/table"
import { MatPaginator } from "@angular/material/paginator"
import { MatSort } from "@angular/material/sort"
import type { SalesData } from "../../models/analytics.model"

@Component({
  selector: "app-data-table",
  templateUrl: "./data-table.component.html",
  styleUrls: ["./data-table.component.scss"],
})
export class DataTableComponent implements OnChanges {
  @Input() salesData: SalesData[] | null = null

  displayedColumns: string[] = [
    "date",
    "product",
    "category",
    "amount",
    "region",
    "customer",
    "paymentMethod",
    "status",
  ]

  dataSource = new MatTableDataSource<SalesData>([])

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["salesData"] && this.salesData) {
      this.dataSource.data = this.salesData

      // Reset pagination when data changes
      if (this.paginator) {
        this.dataSource.paginator = this.paginator
        this.paginator.firstPage()
      }

      // Apply sorting
      if (this.sort) {
        this.dataSource.sort = this.sort
      }
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
  }

  getStatusClass(status: string): string {
    switch (status) {
      case "completed":
        return "status-completed"
      case "pending":
        return "status-pending"
      case "refunded":
        return "status-refunded"
      default:
        return ""
    }
  }
}
