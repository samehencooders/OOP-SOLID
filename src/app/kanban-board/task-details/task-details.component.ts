import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { KanbanBoardService } from '../services/kanban-board.service';
import { Task, TaskStatus, Priority } from '../models/task.model';
import { User } from '../models/user.model';
import { TaskModalComponent } from '../task-modal/task-modal.component';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent implements OnInit, OnDestroy {

  taskId: string | null = null;
  task: Task | null = null;
  subtasks: Task[] = [];
  users: User[] = [];
  assignedUser: User | null = null;
  parentTask: Task | null = null;
  
  Priority = Priority;
  TaskStatus = TaskStatus;
  
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private kanbanService: KanbanBoardService,
    private dialog: MatDialog
  ) { }
    ngOnDestroy(): void {
        throw new Error('Method not implemented.');
    }

  // Add this property to store dependency tasks
  dependencyTasks: Map<string, Task> = new Map();
  
  // Add this method to load dependencies
  loadDependencies(): void {
    if (!this.task || !this.task.dependencies || this.task.dependencies.length === 0) {
      return;
    }
    
    // Clear existing dependencies
    this.dependencyTasks.clear();
    
    // Load each dependency
    this.task.dependencies.forEach(dependencyId => {
      this.kanbanService.getTaskById(dependencyId).subscribe(task => {
        if (task) {
          this.dependencyTasks.set(dependencyId, task);
        }
      });
    });
  }
  
  // Add this method to get a dependency task by ID
  getDependencyTask(dependencyId: string): Task | undefined {
    return this.dependencyTasks.get(dependencyId);
  }

  // Update ngOnInit to call loadDependencies after loading task details
  ngOnInit(): void {
    this.route.paramMap.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      this.taskId = params.get('id');
      if (this.taskId) {
        this.loadTaskDetails();
      }
    });
    
    this.kanbanService.users$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(users => {
      this.users = users;
      if (this.task) {
        this.assignedUser = this.users.find(u => u.id === this.task?.assignedTo) || null;
      }
    });
  }

  // Update loadTaskDetails to call loadDependencies
  loadTaskDetails(): void {
    if (!this.taskId) return;
    
    this.kanbanService.getTaskById(this.taskId).pipe(
      takeUntil(this.destroy$)
    ).subscribe(task => {
      if (task) {
        this.task = task;
        this.assignedUser = this.users.find(u => u.id === task.assignedTo) || null;
        
        // Load parent task if this is a subtask
        if (task.parentId) {
          this.kanbanService.getTaskById(task.parentId).pipe(
            takeUntil(this.destroy$)
          ).subscribe(parentTask => {
            this.parentTask = parentTask;
          });
        }
        
        // Load subtasks
        this.loadSubtasks();
        
        // Load dependencies
        this.loadDependencies();
      } else {
        this.router.navigate(['/board']);
      }
    });
  }

  loadSubtasks(): void {
    if (!this.task) return;
    
    this.kanbanService.getSubtasks(this.task.id).pipe(
      takeUntil(this.destroy$)
    ).subscribe(subtasks => {
      this.subtasks = subtasks;
    });
  }

  createSubtask(): void {
    if (!this.task) return;
    
    const dialogRef = this.dialog.open(TaskModalComponent, {
      width: '600px',
      data: { 
        task: null,
        users: this.users,
        assignedUserId: this.task.assignedTo,
        isSubtask: true,
        parentTask: this.task
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.kanbanService.createTask(result, this.task!.id).subscribe(() => {
          this.loadSubtasks();
        });
      }
    });
  }

  editTask(): void {
    if (!this.task) return;
    
    const dialogRef = this.dialog.open(TaskModalComponent, {
      width: '600px',
      data: { 
        task: this.task,
        users: this.users
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.kanbanService.updateTask(result).subscribe(() => {
          this.loadTaskDetails();
        });
      }
    });
  }

  editSubtask(subtask: Task): void {
    const dialogRef = this.dialog.open(TaskModalComponent, {
      width: '600px',
      data: { 
        task: subtask,
        users: this.users,
        isSubtask: true,
        parentTask: this.task
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.kanbanService.updateTask(result).subscribe(() => {
          this.loadSubtasks();
        });
      }
    });
  }

  deleteSubtask(subtaskId: string): void {
    if (confirm('Are you sure you want to delete this subtask?')) {
      this.kanbanService.deleteTask(subtaskId).subscribe(() => {
        this.loadSubtasks();
      });
    }
  }

  toggleTaskBlocked(): void {
    if (!this.task) return;
    
    const updatedTask = {
      ...this.task,
      blocked: !this.task.blocked,
      updatedAt: new Date()
    };
    
    this.kanbanService.updateTask(updatedTask).subscribe(() => {
      this.loadTaskDetails();
    });
  }

  updateTaskStatus(status: TaskStatus): void {
    if (!this.task) return;
    
    const updatedTask = {
      ...this.task,
      status: status,
      updatedAt: new Date()
    };
    
    this.kanbanService.updateTask(updatedTask).subscribe(() => {
      this.loadTaskDetails();
    });
  }

  getStatusColor(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.TODO: return 'primary';
      case TaskStatus.IN_PROGRESS: return 'accent';
      case TaskStatus.DONE: return 'primary';
      case TaskStatus.ARCHIVED: return '';
      default: return '';
    }
  }

  getPriorityColor(priority: Priority): string {
    switch (priority) {
      case Priority.HIGH: return 'warn';
      case Priority.MEDIUM: return 'accent';
      case Priority.LOW: return 'primary';
      default: return '';
    }
  }

  getTagColor(tag: string): string {
    // Map tags to colors
    const tagColors: Record<string, string> = {
      'Bug': 'warn',
      'Feature': 'primary',
      'Documentation': 'accent',
      'Urgent': 'warn'
    };
    
    return tagColors[tag] || '';
  }

  getSubtaskProgress(): number {
    if (!this.subtasks.length) {
      return 0;
    }
    
    const completed = this.subtasks.filter(st => st.status === TaskStatus.DONE).length;
    return (completed / this.subtasks.length) * 100;
  }

  goBack(): void {
    this.router.navigate(['/board']);
  }

  /**
   * Updates the status of a subtask
   * @param subtask The subtask to update
   * @param isChecked Whether the checkbox is checked
   */
  updateSubtaskStatus(subtask: Task, isChecked: boolean): void {
    const newStatus = isChecked ? TaskStatus.DONE : TaskStatus.IN_PROGRESS;
    
    const updatedSubtask = {
      ...subtask,
      status: newStatus,
      updatedAt: new Date()
    };
    
    this.kanbanService.updateTask(updatedSubtask).subscribe(() => {
      this.loadSubtasks();
    });
  }
  
  /**
   * Gets the count of completed subtasks
   * @returns The number of completed subtasks
   */
  getCompletedSubtasksCount(): number {
    return this.subtasks.filter(st => st.status === TaskStatus.DONE).length;
  }
  
  /**
   * Checks if a date is near (within 2 days)
   * @param date The date to check
   * @returns True if the date is within 2 days
   */
  isDateNear(date: Date | string | undefined): boolean {
    if (!date) {
      return false;
    }
    
    const dueDate = new Date(date);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays >= 0 && diffDays <= 2; // Due within 2 days
  }
}