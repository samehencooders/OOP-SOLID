import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Task, TaskPriority, Checklist, ChecklistItem } from '../../models/task.model';
import { Workflow, WorkflowStage } from '../../models/workflow.model';
import { TaskService } from '../../services/task.service';
import { AiService } from '../../services/ai.service';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit {
getSelectedTabIndex(): import("@angular/cdk/coercion").NumberInput {
throw new Error('Method not implemented.');
}
  task: Task;
  workflow: Workflow;
  taskForm: FormGroup;
  editMode = false;
  loading = false;
  priorities = Object.values(TaskPriority);
  activeTab = 'details';
  
  predictionLoading = false;
  prediction: { predictedDays: number; confidence: number; factors: any[] } | null = null;
  
  riskAnalysisLoading = false;
  riskAnalysis: { riskScore: number; factors: any[]; mitigationSuggestions: string[] } | null = null;
  
  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private aiService: AiService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<TaskDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { task: Task; workflow: Workflow }
  ) {
    this.task = data.task;
    this.workflow = data.workflow;
    
    this.taskForm = this.fb.group({
      title: [this.task.title, Validators.required],
      description: [this.task.description],
      stageId: [this.task.stageId, Validators.required],
      priority: [this.task.priority, Validators.required],
      dueDate: [this.task.dueDate],
      assignees: [this.task.assignees],
      tags: [this.task.tags],
      estimatedTime: [this.task.estimatedTime],
      isBlocked: [this.task.isBlocked],
      blockReason: [this.task.blockReason]
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
    if (!this.task.isBlocked) {
      this.taskForm.get('blockReason')?.disable();
    }
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  saveTask(): void {
    if (this.taskForm.invalid) {
      return;
    }
    
    this.loading = true;
    const updatedTask = {
      ...this.taskForm.value
    };
    
    this.taskService.updateTask(this.task.id, updatedTask).subscribe({
      next: (task) => {
        this.task = task;
        this.editMode = false;
        this.loading = false;
        this.snackBar.open('Task updated successfully', 'Close', { duration: 3000 });
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open('Failed to update task', 'Close', { duration: 3000 });
        console.error(err);
      }
    });
  }

  deleteTask(): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.loading = true;
      this.taskService.deleteTask(this.task.id).subscribe({
        next: () => {
          this.loading = false;
          this.snackBar.open('Task deleted successfully', 'Close', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.loading = false;
          this.snackBar.open('Failed to delete task', 'Close', { duration: 3000 });
          console.error(err);
        }
      });
    }
  }

  addComment(content: string): void {
    if (!content.trim()) return;
    
    const comment = {
      content,
      createdAt: new Date(),
      createdBy: 'current-user-id', // This would come from an auth service
      mentions: [],
      attachments: [],
      isEdited: false
    };
    
    this.taskService.addComment(this.task.id, comment).subscribe({
      next: (newComment) => {
        this.task.comments.push(newComment);
        this.snackBar.open('Comment added', 'Close', { duration: 2000 });
      },
      error: (err) => {
        this.snackBar.open('Failed to add comment', 'Close', { duration: 3000 });
        console.error(err);
      }
    });
  }

  toggleChecklistItem(checklistId: string, itemId: string, isCompleted: boolean): void {
    const checklist = this.task.checklists.find(cl => cl.id === checklistId);
    if (!checklist) return;
    
    const updatedChecklist = {
      ...checklist,
      items: checklist.items.map(item => 
        item.id === itemId ? { ...item, isCompleted } : item
      )
    };
    
    this.taskService.updateCheckList(this.task.id, updatedChecklist).subscribe({
      next: (updated) => {
        // Update the local task object
        const index = this.task.checklists.findIndex(cl => cl.id === checklistId);
        if (index !== -1) {
          this.task.checklists[index] = updated;
        }
      },
      error: (err) => {
        this.snackBar.open('Failed to update checklist', 'Close', { duration: 3000 });
        console.error(err);
      }
    });
  }

  predictTaskCompletion(): void {
    this.predictionLoading = true;
    this.aiService.predictTaskCompletionTime(this.task.id).subscribe({
      next: (prediction) => {
        this.prediction = prediction;
        this.predictionLoading = false;
      },
      error: (err) => {
        this.predictionLoading = false;
        this.snackBar.open('Failed to predict completion time', 'Close', { duration: 3000 });
        console.error(err);
      }
    });
  }

  analyzeTaskRisk(): void {
    this.riskAnalysisLoading = true;
    this.aiService.analyzeTaskRisk(this.task.id).subscribe({
      next: (analysis) => {
        this.riskAnalysis = analysis;
        this.riskAnalysisLoading = false;
      },
      error: (err) => {
        this.riskAnalysisLoading = false;
        this.snackBar.open('Failed to analyze risk', 'Close', { duration: 3000 });
        console.error(err);
      }
    });
  }

  generateAiChecklist(): void {
    this.aiService.generateChecklist(this.task.id).subscribe({
      next: (items) => {
        // Create a new checklist with the AI-generated items
        const newChecklist: Partial<Checklist> = {
          id: `checklist-${Date.now()}`,
          title: 'AI-Generated Checklist',
          items: items.map(item => ({
            id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            content: item.content,
            isCompleted: false
          }))
        };
        
        // Add the checklist to the task
        this.task.checklists.push(newChecklist as Checklist);
        
        this.snackBar.open('AI checklist generated', 'Close', { duration: 3000 });
      },
      error: (err) => {
        this.snackBar.open('Failed to generate checklist', 'Close', { duration: 3000 });
        console.error(err);
      }
    });
  }

  suggestAssignee(): void {
    this.aiService.suggestAssignee(this.task.id).subscribe({
      next: (suggestion) => {
        // Update the form with the suggested assignee
        const currentAssignees = this.taskForm.get('assignees')?.value || [];
        if (!currentAssignees.includes(suggestion.userId)) {
          this.taskForm.patchValue({
            assignees: [...currentAssignees, suggestion.userId]
          });
          
          this.snackBar.open(`AI suggested assignee: ${suggestion.userId} (${suggestion.confidence.toFixed(2)}% confidence)`, 'Close', { duration: 5000 });
        } else {
          this.snackBar.open('Suggested assignee is already assigned to this task', 'Close', { duration: 3000 });
        }
      },
      error: (err) => {
        this.snackBar.open('Failed to get assignee suggestion', 'Close', { duration: 3000 });
        console.error(err);
      }
    });
  }

  getStageById(stageId: string): WorkflowStage | undefined {
    return this.workflow.stages.find(stage => stage.id === stageId);
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
  // Add these methods to the TaskDetailComponent class

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
  
  addChecklist(): void {
    const newChecklist: Checklist = {
      id: `checklist-${Date.now()}`,
      title: 'New Checklist',
      items: []
    };
    
    this.task.checklists.push(newChecklist);
  }
  
  addChecklistItem(checklistId: string): void {
    const checklist = this.task.checklists.find(cl => cl.id === checklistId);
    if (!checklist) return;
    
    const newItem: ChecklistItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: 'New item',
      isCompleted: false
    };
    
    checklist.items.push(newItem);
    
    // Update the checklist in the backend
    this.taskService.updateCheckList(this.task.id, checklist).subscribe({
      next: (updated) => {
        // Update the local task object
        const index = this.task.checklists.findIndex(cl => cl.id === checklistId);
        if (index !== -1) {
          this.task.checklists[index] = updated;
        }
      },
      error: (err) => {
        this.snackBar.open('Failed to update checklist', 'Close', { duration: 3000 });
        console.error(err);
      }
    });
  }
  
  getAttachmentIcon(type: string): string {
    if (type.startsWith('image/')) return 'image';
    if (type.startsWith('video/')) return 'videocam';
    if (type.startsWith('audio/')) return 'audiotrack';
    if (type.includes('pdf')) return 'picture_as_pdf';
    if (type.includes('word') || type.includes('document')) return 'description';
    if (type.includes('excel') || type.includes('spreadsheet')) return 'table_chart';
    if (type.includes('powerpoint') || type.includes('presentation')) return 'slideshow';
    return 'insert_drive_file';
  }
  
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  downloadAttachment(attachment: any): void {
    window.open(attachment.url, '_blank');
  }
  
  deleteAttachment(attachmentId: string): void {
    // Implementation would depend on your backend API
    console.log('Delete attachment:', attachmentId);
  }
  
  uploadAttachment(event: any): void {
    const file = event.target.files[0];
    if (!file) return;
    
    // Implementation would depend on your backend API
    console.log('Upload attachment:', file);
  }
  getChecklistProgress(checklist: any): string {
    if (!checklist || !checklist.items) {
      return '0 / 0';
    }
    
    const totalItems = checklist.items.length;
    const completedItems = checklist.items.filter((item: any) => item.isCompleted).length;
    
    return `${completedItems} / ${totalItems}`;
  }
}
