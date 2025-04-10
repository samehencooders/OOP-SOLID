import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TaskModel } from '../../models/task.model';
import { Status } from '../../models/status.enum';
import { Priority } from '../../models/priority.enum';
import { TaskService } from '../../services/task.service';
import { TaskFilterService } from '../../services/task-filter.service';
import { Observable } from 'rxjs';
import { UpdateTask } from '../../models/update-task.interface';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit {
  private dataChanged$!: Observable<boolean>;
  [key: string]: any;
  tasks: TaskModel[] = [];
  filteredTasks: TaskModel[] = [];
  selectedStatus: Status | null = null;
  selectedPriority: Priority | null = null;
   showForm = false;
  selectedTaskForEdit: TaskModel | null = null;

  constructor(
    private _taskService: TaskService,
    private _taskFilterService: TaskFilterService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this._taskService.dataChanged.subscribe({
      next: (changed) => {
        this.tasks = this._taskService.getTasks();
        this.filteredTasks = [...this.tasks];
      },
    });
  }
  onStatusFilterChange(status: Status | null): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  onPriorityFilterChange(priority: Priority | null): void {
    this.selectedPriority = priority;
    this.applyFilters();
  }

  private applyFilters(): void {
    this.filteredTasks = this._taskFilterService.filterByStatus(
      this.tasks,
      this.selectedStatus
    );
    this.filteredTasks = this._taskFilterService.filterByPriority(
      this.filteredTasks,
      this.selectedPriority
    );
  }
  editTask(task: TaskModel): void {
    this.selectedTaskForEdit = { ...task };
    this.showForm = true;
  }
  deleteTask(id: number) {
    this._taskService.deleteTask(id);
  }
  openFormForNew(): void {
    this.selectedTaskForEdit = null;
    this.showForm = true;
  }
  onTaskFormCancel(): void {
    this.showForm = false;
    this.selectedTaskForEdit = null;
  }
  onTaskFormSave(taskObj: UpdateTask) {
    const newUpdatedTask = this._taskService.executeAddOrUpdate(
      taskObj.updatedTask,
      taskObj.id
    );
    this.selectedTaskForEdit = { ...newUpdatedTask };
  }

  onSelectedTask(task: TaskModel) {
    this.selectedTaskForEdit = task;
    this.editTask(task);
  }
}
