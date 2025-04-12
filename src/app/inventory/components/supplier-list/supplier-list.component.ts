import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { SupplierService } from '../../services/supplier.services';
import { MatTableDataSource } from '@angular/material/table';
import { Supplier } from '../../models/supplier.model';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SupplierFormDialogComponent } from '../../modals/supplier-form-dialog/supplier-form-dialog.component';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.scss'],
})
export class SupplierListComponent implements OnInit, OnDestroy, AfterViewInit {
  dataSource = new MatTableDataSource<Supplier>([]);
  displayedColumns: string[] = [
    'name',
    'contactPerson',
    'email',
    'phone',
    'rating',
    'leadTime',
    'isActive',
    'actions',
  ];
  searchControl = new FormControl('');
  loading = true;
  error: string | null = null;
  private destrory$ = new Subject<void>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private supplierService: SupplierService,
    private dialg: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSuppliers();
    this.setupSearch();
  }
  ngOnDestroy(): void {
    this.destrory$.next();
    this.destrory$.complete();
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  loadSuppliers(): void {
    this.loading = true;
    this.error = null;
    this.supplierService
      .loadSuppliers()
      .pipe(takeUntil(this.destrory$))
      .subscribe({
        next: (suppliers) => {
          this.dataSource.data = suppliers;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'failed to load suppliers, Please try again';
          this.loading = false;
          console.error('Fetched Error > Component', err);
        },
      });
  }
  setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        takeUntil(this.destrory$),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((value) => {
        this.applyFilter(value || '');
      });
  }
  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue?.trim().toLocaleLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  addOrUpdate(supplierToEdit?: Supplier) {
    const title = supplierToEdit ? 'Edit Supplier ' : 'Add Supplier';
    const data = { title: title, supplier: supplierToEdit ?? null };
    const dialogRef = this.dialg.open(SupplierFormDialogComponent, {
      width: '800px',
      data: data,
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destrory$))
      .subscribe((result) => {
        if (result) this.loadSuppliers();
      });
  }
  openDeleteDialog(supplier: Supplier) {
    const dialogRef = this.dialg.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Supplier',
        message: `Are you sure you want to delete ${supplier.name}?`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
      },
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destrory$))
      .subscribe((result) => {
        if (result) this.deleteSupplier(supplier.id);
      });
  }
  deleteSupplier(id: string) {
    this.supplierService
      .deleteSupplier(id)
      .pipe(takeUntil(this.destrory$))
      .subscribe({
        next: () => {
          this.loadSuppliers();
        },
        error: (err) => {
          this.error = 'Failed to delete Suppllier , Please Try again.';
          console.error('Error Deleting Supplier:', err);
        },
      });
  }
  viewSupplierDetails(id: string): void {
    this.router.navigate(['/supplier', id]);
  }
  getDisplayRating(rating: number): string {
    const fullStars = '★'.repeat(Math.floor(rating));
    const emptyStars = '☆'.repeat(5 - Math.floor(rating));
    return fullStars + emptyStars;
  }
  toggleActiveStatus(supplier: Supplier, event: any): void {
    event.stopPropagation();
    const updatedSupplier = {
      ...supplier,
      isActive: !supplier.isActive,
    };
    this.supplierService
      .updateSupplier(supplier.id, updatedSupplier)
      .pipe(takeUntil(this.destrory$))
      .subscribe({
        next: () => {},
        error: (err) => {
          this.error =
            'Failed to update supplier status, Please Try again later.';
          console.error(`Failed to update Supplier Status:`, err);
        },
      });
  }

  // openAddDialog() {
  //   const dialogRef = this.dialg.open(SupplierFormDialogComponent, {
  //     width: '800px',
  //     data: { title: 'Add Supplier', supplier: null },
  //   });
  //   dialogRef
  //     .afterClosed()
  //     .pipe(takeUntil(this.destrory$))
  //     .subscribe((result) => {
  //       if (result) this.loadSuppliers();
  //     });
  // }
  // openEditDialog(supplier: Supplier): void {
  //   const dialogRef = this.dialg.open(SupplierFormDialogComponent, {
  //     width: '800px',
  //     data: { title: 'Edit Supplier', supplier },
  //   });
  //   dialogRef
  //     .afterClosed()
  //     .pipe(takeUntil(this.destrory$))
  //     .subscribe((result) => {
  //       if (result) this.loadSuppliers();
  //     });
  // }
  refresh() {
    this.loadSuppliers();
  }
}
