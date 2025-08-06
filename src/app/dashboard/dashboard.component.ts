import { Component, OnInit } from '@angular/core';
import { TaskService } from '../services/task.service';
import { InventoryService } from '../inventory/services/inventory.service';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  tasks$!: Observable<Task[]>;
  totalInventoryValue$!: Observable<number>;

  constructor(
    private taskService: TaskService,
    private inventoryService: InventoryService
  ) { }

  ngOnInit(): void {
    this.tasks$ = this.taskService.tasks$;
    this.totalInventoryValue$ = this.inventoryService.getTotalInventoryValue();
  }
}
