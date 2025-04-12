import { Component, OnInit, ViewChild } from '@angular/core';
import { SupplierService } from '../../services/supplier.services';
import { MatTableDataSource } from '@angular/material/table';
import { Supplier } from '../../models/supplier.model';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.scss'],
})
export class SupplierListComponent implements OnInit {
  dataSource = new MatTableDataSource<Supplier[]>([]);
  displayColumns: string[] = [
    'name',
    'contactPerson',
    'email',
    'phone',
    'rating',
    'leatTime',
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
    this.supplierService.loadSuppliers().subscribe({
      next: (res) => {},
    });
  }









  refresh(){}
  opednAddDialog(){
  }
}
