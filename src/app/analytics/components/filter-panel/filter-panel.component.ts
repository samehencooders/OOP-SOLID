import { Component, Input, Output, EventEmitter } from "@angular/core"
import type { FormGroup } from "@angular/forms"

@Component({
  selector: "app-filter-panel",
  templateUrl: "./filter-panel.component.html",
  styleUrls: ["./filter-panel.component.scss"],
})
export class FilterPanelComponent {
  @Input() filterForm!: FormGroup
  @Input() categories: string[] = []
  @Input() regions: string[] = []
  @Input() statuses: string[] = []
  @Input() dateRange: { min: Date; max: Date } = { min: new Date(), max: new Date() }
  @Input() amountRange: { min: number; max: number } = { min: 0, max: 0 }

  @Output() resetFilters = new EventEmitter<void>()

  isExpanded = false

  toggleExpand(): void {
    this.isExpanded = !this.isExpanded
  }

  onResetFilters(): void {
    this.resetFilters.emit()
  }
}
