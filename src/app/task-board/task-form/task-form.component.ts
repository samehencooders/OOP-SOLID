import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Task, TaskPriority } from '../../models/task.model';
import { Workflow } from '../../models/workflow.model';
import { TaskService } from '../../services/task.service';
import { AiService } from '../../services/ai.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  workflow: Workflow;
  priorities = Object.values(TaskPriority);
  loading = false;
  naturalLanguageInput = '';
  processingNlp = false;
  
  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private aiService: AiService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<TaskFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { workflow: Workflow; initialStageId: string }
  ) {
    this.workflow = data.workflow;
    
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      stageId: [data.initialStageId, Validators.required],
      priority: [TaskPriority.MEDIUM, Validators.required],
      dueDate: [null],
      assignees: [[]],
      tags: [[]],
      estimatedTime: [0],
      isBlocked: [false],
      blockReason: ['']
    });
  }

  ngOnInit(): void {
    // Disable blockReason field if task is not blocked
    this.taskForm.get('isBlocked')?.valueChanges.subscribe(isBlocked => {
      const blockReasonControl = this.taskForm.get('blockReason');
      if (isBlocked) {
        blockReasonControl?.enable();
      } else {
        blockReasonControl?.disable();
      }
    });
    
    // Initialize blockReason state
    this.taskForm.get('blockReason')?.disable();
  }

  createTask(): void {
    if (this.taskForm.invalid) {
      return;
    }
    
    this.loading = true;
    const newTask: Partial<Task> = {
      ...this.taskForm.value,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'current-user-id', // This would come from an auth service
      checklists: [],
      attachments: [],
      comments: [],
      actualTime: 0,
      riskScore: 0
    };
    
    this.taskService.createTask(newTask as Task).subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open('Task created successfully', 'Close', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open('Failed to create task', 'Close', { duration: 3000 });
        console.error(err);
      }
    });
  }

  processNaturalLanguage(): void {
    if (!this.naturalLanguageInput.trim()) return;
    
    this.processingNlp = true;
    this.aiService.processNaturalLanguageTask(this.naturalLanguageInput).subscribe({
      next: (taskData) => {
        this.processingNlp = false;
        
        // Update form with AI-generated data
        this.taskForm.patchValue({
          title: taskData.title || this.taskForm.get('title')?.value,
          description: taskData.description || this.taskForm.get('description')?.value,
          priority: taskData.priority || this.taskForm.get('priority')?.value,
          dueDate: taskData.dueDate || this.taskForm.get('dueDate')?.value,
          estimatedTime: taskData.estimatedTime || this.taskForm.get('estimatedTime')?.value,
          tags: taskData.tags || this.taskForm.get('tags')?.value
        });
        
        this.snackBar.open('Task details extracted from natural language input', 'Close', { duration: 3000 });
      },
      error: (err) => {
        this.processingNlp = false;
        this.snackBar.open('Failed to process natural language input', 'Close', { duration: 3000 });
        console.error(err);
      }
    });
  }

  removeAssignee(assignee: string): void {
    const assignees = this.taskForm.get('assignees')?.value as string[];
    this.taskForm.patchValue({
      assignees: assignees.filter(a => a !== assignee)
    });
  }

  addAssignee(event: any): void {
    const input = event.input;
    const value = event.value.trim();
    
    if (value) {
      const assignees = this.taskForm.get('assignees')?.value as string[] || [];
      this.taskForm.patchValue({
        assignees: [...assignees, value]
      });
    }
    
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeTag(tag: string): void {
    const tags = this.taskForm.get('tags')?.value as string[];
    this.taskForm.patchValue({
      tags: tags.filter(t => t !== tag)
    });
  }

  addTag(event: any): void {
    const input = event.input;
    const value = event.value.trim();
    
    if (value) {
      const tags = this.taskForm.get('tags')?.value as string[] || [];
      this.taskForm.patchValue({
        tags: [...tags, value]
      });
    }
    
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }
}