import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  Subject,
  takeUntil,
} from 'rxjs';
import {
  InventoryItem,
  InventoryItemModel,
} from 'src/app/inventory/models/inventory-item.model';
import { InventoryService } from 'src/app/inventory/services/inventory.service';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss'],
})
export class InventoryListComponent implements OnInit, OnDestroy {
  // Table data source
  dataSource = new MatTableDataSource<InventoryItem>([])

  // Columns to display in the table
  displayedColumns: string[] = ["imageUrl", "sku", "name", "category", "currentStock", "price", "actions"]

  // Search form control
  searchControl = new FormControl("")

  // Loading state
  loading = true

  // Error message
  error: string | null = null

  // Subject for unsubscribing from observables
  private destroy$ = new Subject<void>()

  // References to Angular Material components
  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort

  constructor(
    private inventoryService: InventoryService,
    // private notificationService: NotificationService,
    private dialog: MatDialog,
    private router: Router,
  ) {}

  /**
   * Initialize the component
   */
  ngOnInit(): void {
    // Load inventory items
    this.loadInventoryItems()

    // Set up search with debounce
    this.setupSearch()
  }

  /**
   * Clean up subscriptions when component is destroyed
   */
  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  /**
   * After view initialization, set up the paginator and sort
   */
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
  }

  /**
   * Load inventory items from the service
   */
  loadInventoryItems(): void {
    this.loading = true
    this.error = null

    this.inventoryService
      .loadInventoryItems()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (items) => {
          this.dataSource.data = items
          this.loading = false
        },
        error: (err) => {
          this.error = "Failed to load inventory items. Please try again."
          this.loading = false
          console.error("Error loading inventory items:", err)
        },
      })
  }

  /**
   * Set up the search functionality with debounce
   */
  setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        this.applyFilter(value)
      })
  }

  /**
   * Apply filter to the table data source
   * @param filterValue The filter value
   */
  applyFilter(filterValue: string |null): void {
    if (!filterValue) {
      this.dataSource.filter = ""
      return
    }
    this.dataSource.filter = filterValue.trim().toLowerCase()

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage()
    }
  }

  /**
   * Open the dialog to add a new inventory item
   */
  openAddDialog(): void {
    // const dialogRef = this.dialog.open(InventoryFormDialogComponent, {
    //   width: "800px",
    //   data: { title: "Add Inventory Item", item: null },
    // })

    // dialogRef
    //   .afterClosed()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((result) => {
    //     if (result) {
    //       this.loadInventoryItems()
    //     }
    //   })
  }

  /**
   * Open the dialog to edit an existing inventory item
   * @param item The inventory item to edit
   */
  openEditDialog(item: InventoryItem): void {
    // const dialogRef = this.dialog.open(InventoryFormDialogComponent, {
    //   width: "800px",
    //   data: { title: "Edit Inventory Item", item },
    // })

    // dialogRef
    //   .afterClosed()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((result) => {
    //     if (result) {
    //       this.loadInventoryItems()
    //     }
    //   })
  }

  /**
   * Open the dialog to confirm deletion of an inventory item
   * @param item The inventory item to delete
   */
  openDeleteDialog(item: InventoryItem): void {
    // const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    //   width: "400px",
    //   data: {
    //     title: "Delete Inventory Item",
    //     message: `Are you sure you want to delete ${item.name}?`,
    //     confirmText: "Delete",
    //     cancelText: "Cancel",
    //   },
    // })

    // dialogRef
    //   .afterClosed()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((result) => {
    //     if (result) {
    //       this.deleteItem(item.id)
    //     }
    //   })
  }

  /**
   * Delete an inventory item
   * @param id The ID of the item to delete
   */
  deleteItem(id: string): void {
    this.inventoryService
      .deleteInventoryItem(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadInventoryItems()
        },
        error: (err) => {
          this.error = "Failed to delete inventory item. Please try again."
          console.error("Error deleting inventory item:", err)
        },
      })
  }

  /**
   * Navigate to the detail view for an inventory item
   * @param id The ID of the item to view
   */
  viewItemDetails(id: string): void {
    this.router.navigate(["/inventory", id])
  }

  /**
   * Open the dialog to record a stock movement
   * @param item The inventory item for the stock movement
   */
  openStockMovementDialog(item: InventoryItem): void {
    // const dialogRef = this.dialog.open(StockMovementDialogComponent, {
    //   width: "600px",
    //   data: { item },
    // })

    // dialogRef
    //   .afterClosed()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((result) => {
    //     if (result) {
    //       this.loadInventoryItems()
    //     }
    //   })
  }

  /**
   * Get the CSS class for the stock level
   * @param item The inventory item
   * @returns The CSS class name
   */
  getStockLevelClass(item: InventoryItem): string {
    if (item.currentStock === 0) {
      return "out-of-stock"
    } else if (item.currentStock <= item.minimumStock) {
      return "low-stock"
    } else {
      return "normal-stock"
    }
  }

  /**
   * Refresh the inventory list
   */
  refresh(): void {
    this.loadInventoryItems()
  }
}
