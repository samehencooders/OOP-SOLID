import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {
  InventoryItem,
  InventoryItemModel,
} from '../../models/inventory-item.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InventoryService } from '../../services/inventory.service';
import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  Subject,
  takeUntil,
} from 'rxjs';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss'],
})
export class InventoryListComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  displayedColumns: string[] = [
    'image',
    'name',
    'category',
    'currentStock',
    'price',
    'actions',
  ];
  dataSource = new MatTableDataSource<InventoryItem>([]);
  isLoading: boolean = false;
  searchForm!: FormGroup;
  filterTypeControl = new FormControl('all');
  selectedFilter: string = 'all';
  private destroy$ = new Subject<void>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private inventoryService: InventoryService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      searchTerm: [''],
    });
  }

  ngOnInit(): void {
    this.loadInventoryItems();
    this.searchForm
      .get('searchTerm')
      ?.valueChanges.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((query) => {
        this.applyFilter(query);
      });

    this.inventoryService.inventoryObservable$
      .pipe(takeUntil(this.destroy$))
      .subscribe((items: InventoryItem[]) => {
        this.updateDataSource(items);
      });
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.filterPredicate = (data: InventoryItem, filter: string) => {
      const searchTerms = filter.toLowerCase().split(' ');
      const itemData = `${data.name.toLowerCase()} ${
        data.category?.name.toLowerCase() || ''
      } ${data.sku?.toLowerCase() || ''}`;

      return searchTerms.every((term) => itemData.includes(term));
    };
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadInventoryItems(): void {
    this.isLoading = true;
    this.inventoryService
      .loadInventoryItems()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (items: InventoryItem[]) => {
          this.updateDataSource(items);
        },
        error: (err) => {
          console.log(`an error from console`, err);
          this.snackBar.open('failed to load invetories items', 'Close', {
            duration: 3000,
            panelClass: 'error-snackbar',
          });
        },
      });
  }
  updateDataSource(items: InventoryItem[]) {
    this.dataSource.data = items;
    this.applyFilter();
  }
  applyFilter(query: string = '') {
    if (query) {
      this.dataSource.filter = query;
    }
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.applyFilterByType();
  }
  clearSearch() {
    this.searchForm.get('searchTrim')?.setValue('');
    this.applyFilter();
  }
  applyFilterByType() {}
  openEditItemDialog(_t126: any) {
    throw new Error('Method not implemented.');
  }
  confirmDelete(_t126: any) {
    throw new Error('Method not implemented.');
  }
  openAddStockDialog(_t126: any) {
    throw new Error('Method not implemented.');
  }
  openRemoveStockDialog(_t126: any) {
    throw new Error('Method not implemented.');
  }
  openAddItemDialog() {
    throw new Error('Method not implemented.');
  }
}
