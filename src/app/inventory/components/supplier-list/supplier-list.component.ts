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
  refresh() {}
  opednAddDialog() {}
  getDisplayRating(rating: string) {}
  toggleActiveStatus(supplier: Supplier, event: any) {}
  viewSupplierDetails(id: string) {}
  openEditDialog(supplier: Supplier) {}
  openDeleteDialog(supplier: Supplier) {}
  openAddDialog() {}
}
