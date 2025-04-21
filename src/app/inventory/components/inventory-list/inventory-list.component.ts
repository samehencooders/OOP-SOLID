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
import { finalize, Subject } from 'rxjs';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss'],
})
export class InventoryListComponent
  implements OnInit, AfterViewInit, OnDestroy
{
clearSearch() {
throw new Error('Method not implemented.');
}
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

  ngOnInit(): void {}
  ngAfterViewInit(): void {}
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
  applyFilter(event?: Event) {}
}
