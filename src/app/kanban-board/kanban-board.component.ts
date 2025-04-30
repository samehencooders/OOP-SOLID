import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { KanbanBoardService } from './services/kanban-board.service';
import { Task, TaskStatus, Priority } from './models/task.model';
import { User } from './models/user.model';
import { TaskModalComponent } from './task-modal/task-modal.component';
import { WipLimitDialogComponent } from './wip-limit-dialog/wip-limit-dialog.component';

import { combineLatest, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KanbanBoardComponent implements OnInit {
  @Input() entityId!: string;
  private destroy$ = new Subject<void>();
  users: User[] = [];
  tasks: Task[] = [];
  filteredTasks: Record<string, Task[]> = {};
  wipLimits: Record<string, number> = {};
  
  enableDragDrop = true;
  minimizeTasks = false;
  showArchived = false;
  
  Priority = Priority;

  constructor(
    private kanbanService: KanbanBoardService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  // Add a property to track expanded tasks
  expandedTasks: Set<string> = new Set();
  
  ngOnInit(): void {
    if (!this.entityId) {
      this.entityId = 'project1'; // Default entity
    }
    
    this.kanbanService.loadData(this.entityId);
    
    // Update the tasks observable to include flattened subtasks
    this.kanbanService.tasks$.pipe(
      takeUntil(this.destroy$),
      map(tasks => this.flattenTasksWithSubtasks(tasks))
    ).subscribe(tasks => {
      this.tasks = tasks;
      this.filterTasks();
      this.cdr.markForCheck(); // Mark for check after data changes
    });
    
    combineLatest([
      this.kanbanService.tasks$,
      this.kanbanService.users$,
      this.kanbanService.wipLimits$
    ]).pipe(
      takeUntil(this.destroy$),
      map(([tasks, users, wipLimits]) => {
        this.tasks = tasks;
        this.users = users;
        this.wipLimits = wipLimits;
        
        // Initialize WIP limits if not set
        this.users.forEach(user => {
          if (!this.wipLimits[user.id]) {
            this.wipLimits[user.id] = 5; // Default limit
          }
        });
        
        this.filterTasks();
        this.cdr.markForCheck(); // Mark for check after data changes
      })
    ).subscribe();
  }

  // Add ngOnDestroy for cleanup
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadBoardData(): void {
    this.kanbanService.loadData(this.entityId);
    
    combineLatest([
      this.kanbanService.tasks$,
      this.kanbanService.users$,
      this.kanbanService.wipLimits$
    ]).pipe(
      map(([tasks, users, wipLimits]) => {
        this.tasks = tasks;
        this.users = users;
        this.wipLimits = wipLimits;
        
        // Initialize WIP limits if not set
        this.users.forEach(user => {
          if (!this.wipLimits[user.id]) {
            this.wipLimits[user.id] = 5; // Default limit
          }
        });
        
        this.filterTasks();
      })
    ).subscribe();
  }

  // Add this property to store the user IDs for drop lists
  userIds: string[] = [];

  
  toggleDragDrop(): void {
    this.enableDragDrop = !this.enableDragDrop;
    this.cdr.markForCheck();
  }

  toggleMinimizeTasks(): void {
    this.minimizeTasks = !this.minimizeTasks;
    this.cdr.markForCheck();
  }

  toggleArchiveView(): void {
    this.showArchived = !this.showArchived;
    this.filterTasks();
    this.cdr.markForCheck();
  }

  isWipLimitExceeded(userId: string): boolean {
    return this.filteredTasks[userId]?.length > this.wipLimits[userId];
  }

  updateWipLimit(userId: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    const limit = parseInt(input.value, 10);
    if (!isNaN(limit) && limit > 0) {
      this.kanbanService.updateWipLimit(userId, limit).subscribe();
    }
  }

//   openTaskModal(task?: Task, assignedUserId?: string): void {
//     const dialogRef = this.dialog.open(TaskModalComponent, {
//       width: '600px',
//       data: { 
//         task: task ? { ...task } : null,
//         users: this.users,
//         assignedUserId
//       }
//     });

//     dialogRef.afterClosed().subscribe(result => {
//       if (result) {
//         if (result.id) {
//           this.kanbanService.updateTask(result).subscribe();
//         } else {
//           this.kanbanService.createTask(result).subscribe();
//         }
//       }
//     });
//   }

  bulkArchive(userId: string): void {
    this.kanbanService.bulkArchiveTasks([userId]).subscribe();
  }

  drop(event: CdkDragDrop<Task[]>): void {
    if (!this.enableDragDrop) {
      return;
    }
    
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      
      // Update the task's assigned user
      const movedTask = event.container.data[event.currentIndex];
      this.kanbanService.moveTask(movedTask.id, event.container.id).subscribe();
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case TaskStatus.TODO: return 'primary';
      case TaskStatus.IN_PROGRESS: return 'accent';
      case TaskStatus.DONE: return 'primary';
      case TaskStatus.ARCHIVED: return '';
      default: return '';
    }
  }

  getTagColor(tag: string): string {
    // Map tags to colors
    const tagColors = {
      'Bug': 'warn',
      'Feature': 'primary',
      'Documentation': 'accent',
      'Urgent': 'warn'
    };
    
    return tagColors[tag as keyof typeof tagColors] || '';
  }

  getSubtaskProgress(task: Task): number {
    if (!task.subtasks?.length) {
      return 0;
    }
    
    const completed = task.subtasks.filter(st => st.status === TaskStatus.DONE).length;
    return (completed / task.subtasks.length) * 100;
  }

  getCompletedSubtasks(task: Task): number {
    if (!task.subtasks?.length) {
      return 0;
    }
    
    return task.subtasks.filter(st => st.status === TaskStatus.DONE).length;
  }

  // Add method to create a subtask
  /**
   * Opens the task edit dialog
   * @param task The task to edit
   */
  editTask(task: Task): void {
    const dialogRef = this.dialog.open(TaskModalComponent, {
      width: '600px',
      data: { 
        task: task,
        users: this.users
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.kanbanService.updateTask(result).subscribe();
      }
    });
  }
  
  /**
   * Creates a new subtask for the given parent task
   * @param parentTask The parent task
   */
  createSubtask(parentTask: Task): void {
    const dialogRef = this.dialog.open(TaskModalComponent, {
      width: '600px',
      data: { 
        task: null,
        users: this.users,
        assignedUserId: parentTask.assignedTo,
        isSubtask: true,
        parentTask: parentTask
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.kanbanService.createTask(result, parentTask.id).subscribe();
      }
    });
  }
  
  /**
   * Toggles the blocked status of a task
   * @param task The task to toggle
   */
  toggleTaskBlocked(task: Task): void {
    const updatedTask = {
      ...task,
      blocked: !task.blocked,
      updatedAt: new Date()
    };
    
    this.kanbanService.updateTask(updatedTask).subscribe();
  }
  
  /**
   * Archives a completed task
   * @param task The task to archive
   */
  archiveTask(task: Task): void {
    if (task.status !== TaskStatus.DONE) {
      return;
    }
    
    const updatedTask = {
      ...task,
      status: TaskStatus.ARCHIVED,
      updatedAt: new Date()
    };
    
    this.kanbanService.updateTask(updatedTask).subscribe();
  }
  
  /**
   * Opens the task creation modal
   * @param userId The ID of the user to assign the task to
   */
  openTaskModal(userId: string): void {
    const dialogRef = this.dialog.open(TaskModalComponent, {
      width: '600px',
      data: { 
        task: null,
        users: this.users,
        assignedUserId: userId
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.kanbanService.createTask({
          ...result,
          entityId: this.entityId
        }).subscribe(() => {
          this.cdr.markForCheck(); // Mark for check after task creation
        });
      }
    });
  }

  isDateNear(date: Date): boolean {
    const dueDate = new Date(date);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays >= 0 && diffDays <= 2; // Due within 2 days
  }

  // Add these properties for horizontal scrolling
  private isDraggingHorizontally = false;
  private startX = 0;
  private scrollLeft = 0;

  // Add these methods for horizontal scrolling
  onMouseDown(event: MouseEvent): void {
    if (!this.enableDragDrop) return;
    
    const kanbanBoard = document.querySelector('.kanban-board') as HTMLElement;
    if (!kanbanBoard) return;
    
    this.isDraggingHorizontally = true;
    this.startX = event.pageX - kanbanBoard.offsetLeft;
    this.scrollLeft = kanbanBoard.scrollLeft;
    
    // Prevent text selection during drag
    event.preventDefault();
  }
  
  onMouseMove(event: MouseEvent): void {
    if (!this.isDraggingHorizontally) return;
    
    const kanbanBoard = document.querySelector('.kanban-board') as HTMLElement;
    if (!kanbanBoard) return;
    
    const x = event.pageX - kanbanBoard.offsetLeft;
    const walk = (x - this.startX) * 2; // Scroll speed multiplier
    kanbanBoard.scrollLeft = this.scrollLeft - walk;
  }
  
  onMouseUp(): void {
    this.isDraggingHorizontally = false;
  }
  
  onMouseLeave(): void {
    this.isDraggingHorizontally = false;
  }

  // Method to flatten tasks and subtasks into a single array
  flattenTasksWithSubtasks(tasks: Task[]): Task[] {
    let result: Task[] = [];
    
    for (const task of tasks) {
      // Add the parent task
      result.push(task);
      
      // Add subtasks if they exist
      if (task.subtasks && task.subtasks.length > 0) {
        result = [...result, ...task.subtasks];
      }
    }
    
    return result;
  }
  
  // Method to check if a task is a subtask
  isSubtask(task: Task): boolean {
    return !!task.parentId;
  }
  
  // Method to get the parent task
  getParentTask(task: Task): Task | undefined {
    if (!task.parentId) return undefined;
    return this.tasks.find(t => t.id === task.parentId);
  }
  
  // Method to toggle task expansion
  toggleTaskExpansion(taskId: string): void {
    if (this.expandedTasks.has(taskId)) {
      this.expandedTasks.delete(taskId);
    } else {
      this.expandedTasks.add(taskId);
    }
    this.cdr.markForCheck();
  }
  // Method to check if a task is expanded
  isTaskExpanded(taskId: string): boolean {
    return this.expandedTasks.has(taskId);
  }
  
  // Override the filterTasks method to handle subtasks
  filterTasks(): void {
    this.filteredTasks = {};
    
    for (const user of this.users) {
      this.filteredTasks[user.id] = this.tasks.filter(task => {
        // Filter by assigned user
        const isAssignedToUser = task.assignedTo === user.id;
        
        // Filter by archived status
        const matchesArchivedFilter = this.showArchived || task.status !== TaskStatus.ARCHIVED;
        
        return isAssignedToUser && matchesArchivedFilter;
      });
    }
  }

  /**
   * Gets the count of active (non-archived) tasks for a user
   * @param userId The ID of the user
   * @returns The number of active tasks
   */
  getActiveTaskCount(userId: string): number {
    if (!this.filteredTasks[userId]) {
      return 0;
    }
    
    return this.filteredTasks[userId].filter(task => 
      task.status !== TaskStatus.ARCHIVED
    ).length;
  }
  
  /**
   * Gets the WIP limit for a user
   * @param userId The ID of the user
   * @returns The WIP limit value
   */
  getWipLimit(userId: string): number {
    return this.wipLimits[userId] || 0;
  }
  
  // Add these methods to the KanbanBoardComponent class
  
  /**
   * Gets the IDs of all connected drop lists
   * @returns Array of user IDs representing the connected lists
   */
  getConnectedLists(): string[] {
    return this.users.map(user => user.id);
  }
  
  /**
   * Handles the drop event when a task is moved between columns
   * @param event The CdkDragDrop event
   */
  onTaskDrop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      // Reordering within the same column
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.cdr.markForCheck();
    } else {
      // Moving to a different column (user)
      const task = event.previousContainer.data[event.previousIndex];
      const newUserId = event.container.id;
      
      // Check if moving would exceed WIP limit
      if (this.isWipLimitExceeded(newUserId)) {
        // Don't allow the move if it would exceed the WIP limit
        return;
      }
      
      // Update the task's assigned user
      this.kanbanService.moveTask(task.id, newUserId).subscribe(
        updatedTask => {
          // Transfer the item between arrays
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );
          this.cdr.markForCheck();
        },
        error => {
          console.error('Error moving task:', error);
          // Optionally show an error message to the user
        }
      );
    }
  }
  // Update the imports to include the WipLimitDialogComponent
  
  // Then update the openWipLimitDialog method
  openWipLimitDialog(userId: string): void {
    const dialogRef = this.dialog.open(WipLimitDialogComponent, {
      width: '300px',
      data: {
        userId: userId,
        currentLimit: this.wipLimits[userId] || 5
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result && typeof result === 'number') {
        this.kanbanService.updateWipLimit(userId, result).subscribe();
      }
    });
  }
}