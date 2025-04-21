// supplier.component.ts
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Supplier } from '../../models/supplier.model';
import { SupplierService } from '../../services/supplier.services';
import { SupplierFormDialogComponent } from '../../modals/supplier-form-dialog/supplier-form-dialog.component';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-in', style({ opacity: 1 })),
      ]),
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate('400ms ease-out', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
    ]),
  ],
})
export class SupplierListComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['name', 'contactPerson', 'email', 'phone', 'rating', 'leadTime', 'isActive', 'actions'];
  dataSource = new MatTableDataSource<Supplier>([]);
  expandedSupplier: Supplier | null = null;
  
  searchForm: FormGroup;
  filterOptions = {
    showInactive: false,
    leadTimeDays: 30,
    showTopRated: false,
  };
  
  isLoading = true;
  private destroy$ = new Subject<void>();
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(
    private supplierService: SupplierService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      searchQuery: ['']
    });
  }
  
  ngOnInit(): void {
    this.loadSuppliers();
    
    this.searchForm.get('searchQuery')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(query => {
        if (query && query.trim() !== '') {
          this.searchSuppliers(query);
        } else {
          this.loadSuppliers();
        }
      });
    
    this.supplierService.suppliers$
      .pipe(takeUntil(this.destroy$))
      .subscribe(suppliers => {
        this.updateDataSource(suppliers);
        this.isLoading = false;
      });
  }
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  loadSuppliers(): void {
    this.isLoading = true;
    this.supplierService.loadSuppliers().subscribe({
      error: () => {
        this.isLoading = false;
        this.showNotification('Failed to load suppliers', 'error');
      }
    });
  }
  
  searchSuppliers(query: string): void {
    this.isLoading = true;
    this.supplierService.searchSupplier(query).subscribe({
      next: (suppliers) => {
        this.updateDataSource(suppliers);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.showNotification('Search failed', 'error');
      }
    });
  }
  
  applyFilters(): void {
    this.isLoading = true;
    
    let filteredSuppliers$ = this.supplierService.suppliers$;
    
    if (this.filterOptions.showTopRated) {
      filteredSuppliers$ = this.supplierService.getTopRatedSuppliers();
    }
    
    if (!this.filterOptions.showInactive) {
      filteredSuppliers$ = this.supplierService.getActiveSuppliers();
    }
    
    filteredSuppliers$ = this.supplierService.getSuppliersWithLeadTimeLessThan(this.filterOptions.leadTimeDays);
    
    filteredSuppliers$.pipe(takeUntil(this.destroy$)).subscribe(suppliers => {
      this.updateDataSource(suppliers);
      this.isLoading = false;
    });
  }
  
  resetFilters(): void {
    this.filterOptions = {
      showInactive: false,
      leadTimeDays: 30,
      showTopRated: false,
    };
    this.searchForm.get('searchQuery')?.setValue('');
    this.loadSuppliers();
  }
  
  updateDataSource(suppliers: Supplier[]): void {
    this.dataSource.data = suppliers;
    
    // Custom filter predicate for material table
    this.dataSource.filterPredicate = (data: Supplier, filter: string) => {
      const searchStr = (data.name + data.contactPerson + data.email + data.phone).toLowerCase();
      return searchStr.indexOf(filter.toLowerCase()) !== -1;
    };
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
  openSupplierDialog(supplier?: Supplier): void {
    const dialogRef = this.dialog.open(SupplierFormDialogComponent, {
      width: '800px',
      data: supplier ? { ...supplier } : {},
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      
      if (result.id) {
        // Update existing supplier
        this.supplierService.updateSupplier(result.id, result).subscribe({
          next: () => this.showNotification('Supplier updated successfully', 'success'),
          error: () => this.showNotification('Failed to update supplier', 'error')
        });
      } else {
        // Create new supplier
        this.supplierService.createSupplier(result).subscribe({
          next: () => this.showNotification('Supplier created successfully', 'success'),
          error: () => this.showNotification('Failed to create supplier', 'error')
        });
      }
    });
  }
  
  deleteSupplier(supplier: Supplier): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Supplier',
        message: `Are you sure you want to delete ${supplier.name}?`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.supplierService.deleteSupplier(supplier.id).subscribe({
          next: () => this.showNotification('Supplier deleted successfully', 'success'),
          error: () => this.showNotification('Failed to delete supplier', 'error')
        });
      }
    });
  }
  
  toggleExpandRow(supplier: Supplier): void {
    this.expandedSupplier = this.expandedSupplier === supplier ? null : supplier;
  }
  
  showNotification(message: string, type: 'success' | 'error' | 'info'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [`notification-${type}`]
    });
  }
}