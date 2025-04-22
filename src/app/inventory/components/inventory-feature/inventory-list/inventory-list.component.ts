import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
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
  displayColumns: string[] = [
    'sku',
    'name',
    'category',
    'currentStock',
    'price',
    'totalValue',
    'status',
    'actions',
  ];
  dataSource = new MatTableDataSource<InventoryItem>();
  isLoading = true;
  displayedColumns: any;
  searchForm!: FormGroup;
  subject$ = new Subject<void>();
  constructor(
    private inventoryService: InventoryService,
    private dialod: MatDialog,
    private snackbar: MatSnackBar,
    private fb: FormBuilder
  ) {}
  ngOnInit(): void {
    this.searchForm = this.fb.group({
      searchQuery: [''],
    });
    this.applyFilter();
    this.loadInventory();
  }
  ngOnDestroy(): void {
    this.subject$.next();
    this.subject$.complete();
  }
  get searchQueryControl() {
    return this.searchForm.get('searchQuery');
  }
  loadInventory(): void {
    this.isLoading = true;
    this.inventoryService
      .loadInventoryItems()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (inventories: InventoryItemModel[]) => {
          this.dataSource.data = inventories;
        },
        error: (err) => {
          this.snackbar.open(
            'an error occur while loading inventory',
            'dismiss',
            {
              duration: 5000,
            }
          );
        },
      });
  }
  applyFilter(): void {
    this.searchQueryControl?.valueChanges
      .pipe(takeUntil(this.subject$), debounceTime(500), distinctUntilChanged())
      .subscribe((value: string) => {
        this.searchInventory(value);
        console.log(value);
      });
  }
  searchInventory(query: string) {
    if (query && query.trim() !== '') {
      this.inventoryService.searchInventoryItems(query).subscribe({
        next: (res: InventoryItem[]) => {
          this.dataSource.data = res;
        },
        error: (err) => {
          this.snackbar.open(
            `an error occur while loading inventory:${err}`,
            'dismiss',
            {
              duration: 5000,
            }
          );
        },
      });
    }
  }

  openAddDialog() {
    throw new Error('Method not implemented.');
  }
  getStatusColor(_t113: any) {
    throw new Error('Method not implemented.');
  }
  getStatusIcon(_t113: any) {
    throw new Error('Method not implemented.');
  }
  openEditDialog(_t126: any) {
    throw new Error('Method not implemented.');
  }
  deleteItem(_t126: any) {
    throw new Error('Method not implemented.');
  }
}
