import { Component, OnInit, OnDestroy, importProvidersFrom } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil, combineLatest } from 'rxjs';
import { Workflow, WorkflowStage } from 'src/app/models/workflow.model';
import { TaskService } from 'src/app/services/task.service';
import { WorkflowService } from 'src/app/services/workflow.service';
import { AiService } from 'src/app/services/ai.service';
import{Task, TaskPriority} from 'src/app/models/task.model'
import { TaskDetailComponent } from '../task-detail-component/task-detail.component';
import { TaskFormComponent } from '../task-form/task-form.component';



@Component({
  selector: 'app-task-board',
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.scss']
})
export class TaskBoardComponent implements OnInit, OnDestroy {
  workflow: Workflow | null = null;
  tasks: Task[] = [];
  tasksByStage: { [stageId: string]: Task[] } = {};
  loading = true;
  error = '';
  
  private destroy$ = new Subject<void>();

  constructor(
    private taskService: TaskService,
    private workflowService: WorkflowService,
    private aiService: AiService,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      if (params['id']) {
        this.loadWorkflowAndTasks(params['id']);
      }
    });

    // Subscribe to task updates
    this.taskService.tasks$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(tasks => {
      this.tasks = tasks;
      this.groupTasksByStage();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadWorkflowAndTasks(workflowId: string): void {
    this.loading = true;
    this.error = '';

    combineLatest([
      this.workflowService.getWorkflowById(workflowId),
      this.taskService.getTaskByWorkflow(workflowId)
    ]).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: ([workflow, tasks]) => {
        this.workflow = workflow;
        this.tasks = tasks;
        this.groupTasksByStage();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load workflow and tasks';
        this.loading = false;
        console.error(err);
      }
    });
  }

  groupTasksByStage(): void {
    if (!this.workflow) return;
    
    // Initialize empty arrays for each stage
    this.tasksByStage = {};
    this.workflow.stages.forEach(stage => {
      this.tasksByStage[stage.id] = [];
    });
    
    // Group tasks by stage
    this.tasks.forEach(task => {
      if (this.tasksByStage[task.stageId]) {
        this.tasksByStage[task.stageId].push(task);
      }
    });
  }

  onTaskDrop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      // Reordering within the same stage
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      // Moving to a different stage
      const task = event.previousContainer.data[event.previousIndex];
      const newStageId = event.container.id;
      
      // Update the task's stage in the backend
      this.taskService.moveTask(task.id, newStageId).subscribe({
        next: () => {
          // The task list will be updated via the subscription to tasks$
        },
        error: (err) => {
          console.error('Failed to move task', err);
          // Revert the UI change by regrouping tasks
          this.groupTasksByStage();
        }
      });
      
      // Optimistically update UI
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  openTaskDetail(task: Task): void {
    const dialogRef = this.dialog.open(TaskDetailComponent, {
      width: '800px',
      data: { task, workflow: this.workflow }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Task was updated or deleted
        this.groupTasksByStage();
      }
    });
  }

  openNewTaskForm(stageId: string): void {
    if (!this.workflow) return;
    
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '600px',
      data: { 
        workflow: this.workflow,
        initialStageId: stageId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // New task was created
        this.groupTasksByStage();
      }
    });
  }

  analyzeWorkflowBottlenecks(): void {
    if (!this.workflow) return;
    
    this.aiService.analyzeWorkflowBottlenecks(this.workflow.id).subscribe({
      next: (bottlenecks) => {
        // Handle bottleneck analysis results
        console.log('Bottleneck analysis:', bottlenecks);
        // Could show this in a dialog or notification
      },
      error: (err) => {
        console.error('Failed to analyze bottlenecks', err);
      }
    });
  }

  suggestWipLimits(): void {
    if (!this.workflow) return;
    
    this.aiService.suggestWipLimits(this.workflow.id).subscribe({
      next: (wipLimits) => {
        // Handle WIP limit suggestions
        console.log('WIP limit suggestions:', wipLimits);
        // Could show this in a dialog with options to apply
      },
      error: (err) => {
        console.error('Failed to get WIP limit suggestions', err);
      }
    });
  }

  generateProjectSummary(): void {
    if (!this.workflow) return;
    
    this.aiService.generateProjectSummary(this.workflow.id).subscribe({
      next: (summary) => {
        // Handle project summary
        console.log('Project summary:', summary);
        // Could show this in a dialog or dedicated view
      },
      error: (err) => {
        console.error('Failed to generate project summary', err);
      }
    });
  }

  getPriorityClass(priority: TaskPriority): string {
    switch (priority) {
      case TaskPriority.LOW:
        return 'priority-low';
      case TaskPriority.MEDIUM:
        return 'priority-medium';
      case TaskPriority.HIGH:
        return 'priority-high';
      case TaskPriority.CRITICAL:
        return 'priority-critical';
      default:
        return '';
    }
  }

  getStageById(stageId: string): WorkflowStage | undefined {
    return this.workflow?.stages.find(stage => stage.id === stageId);
  }

  isWipLimitExceeded(stageId: string): boolean {
    const stage = this.getStageById(stageId);
    if (!stage || stage.wipLimit === null) return false;
    
    return this.tasksByStage[stageId]?.length > stage.wipLimit;
  }
  getCompletedChecklistItems(task: Task): number {
    let completed = 0;
    task.checklists.forEach(checklist => {
      completed += checklist.items.filter(item => item.isCompleted).length;
    });
    return completed;
  }
  
  getTotalChecklistItems(task: Task): number {
    let total = 0;
    task.checklists.forEach(checklist => {
      total += checklist.items.length;
    });
    return total;
  }
}