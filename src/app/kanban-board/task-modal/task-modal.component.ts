import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Priority, Task, TaskStatus } from '../models/task.model';
import { User } from '../models/user.model';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-task-modal',
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskModalComponent implements OnInit {
  taskForm!: FormGroup;
  priorities = Object.values(Priority);
  statuses = Object.values(TaskStatus);
  availableTags = ['Bug', 'Feature', 'Documentation', 'Urgent', 'Enhancement'];
  isSubtaskMode = false;
  
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TaskModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      task: Task | null, 
      users: User[], 
      assignedUserId?: string,
      isSubtask?: boolean,
      parentTask?: Task
    },
    private cdr: ChangeDetectorRef
  ) {
    this.isSubtaskMode = !!data.isSubtask;
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.taskForm = this.fb.group({
      name: [this.data.task?.name || '', Validators.required],
      description: [this.data.task?.description || ''],
      status: [this.data.task?.status || TaskStatus.TODO, Validators.required],
      priority: [this.data.task?.priority || Priority.MEDIUM, Validators.required],
      assignedTo: [this.data.task?.assignedTo || this.data.assignedUserId || '', Validators.required],
      dueDate: [this.data.task?.dueDate || null],
      tags: [this.data.task?.tags || []],
      blocked: [this.data.task?.blocked || false],
      subtasks: this.fb.array([]),
      dependencies: [this.data.task?.dependencies || []]
    });

    // Add existing subtasks if any
    if (this.data.task?.subtasks?.length) {
      this.data.task.subtasks.forEach(subtask => {
        this.subtasksArray.push(this.createSubtaskGroup(subtask));
      });
    }
    this.taskForm.valueChanges.subscribe(() => {
        this.cdr.markForCheck();
      });
  }

  get subtasksArray(): FormArray {
    return this.taskForm.get('subtasks') as FormArray;
  }

  // Updated to accept a Task object
  createSubtaskGroup(subtask?: Task): FormGroup {
    return this.fb.group({
      id: [subtask?.id || ''],
      name: [subtask?.name || '', Validators.required],
      description: [subtask?.description || ''],
      status: [subtask?.status || TaskStatus.TODO],
      priority: [subtask?.priority || Priority.MEDIUM],
      assignedTo: [subtask?.assignedTo || this.taskForm?.get('assignedTo')?.value || ''],
      tags: [subtask?.tags || []],
      blocked: [subtask?.blocked || false],
      dependencies: [subtask?.dependencies || []]
    });
  }

  addSubtask(): void {
    this.subtasksArray.push(this.createSubtaskGroup());
    this.cdr.markForCheck();
  }

  removeSubtask(index: number): void {
    this.subtasksArray.removeAt(index);
    this.cdr.markForCheck();
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      
      // Convert subtasks from form model to Task model
      const subtasks = formValue.subtasks.map((subtaskForm: any) => {
        return {
          id: subtaskForm.id || `subtask-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: subtaskForm.name,
          description: subtaskForm.description || '',
          status: subtaskForm.status,
          priority: subtaskForm.priority,
          assignedTo: subtaskForm.assignedTo,
          tags: subtaskForm.tags || [],
          blocked: subtaskForm.blocked || false,
          dependencies: subtaskForm.dependencies || [],
          createdAt: new Date(),
          updatedAt: new Date(),
          entityId: this.data.task?.entityId || this.data.parentTask?.entityId || 'default',
          parentId: this.data.task?.id || this.data.parentTask?.id
        } as Task;
      });
      
      // Create the task object
      const task: Partial<Task> = {
        ...formValue,
        subtasks: subtasks,
        id: this.data.task?.id,
        createdAt: this.data.task?.createdAt || new Date(),
        updatedAt: new Date(),
        entityId: this.data.task?.entityId || this.data.parentTask?.entityId || 'default',
        parentId: this.isSubtaskMode ? this.data.parentTask?.id : undefined
      };
      
      this.dialogRef.close(task);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  // Add these properties and methods to the TaskModalComponent class
  separatorKeysCodes: number[] = [ENTER, COMMA];
  
  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    const currentTags = this.taskForm.get('tags')?.value || [];
    
    if (value && !currentTags.includes(value)) {
      this.taskForm.get('tags')?.setValue([...currentTags, value]);
      this.cdr.markForCheck();
    }
    
    // Clear the input value
    if (event.input) {
      event.input.value = '';
    }
  }
  
  removeTag(tag: string): void {
    const currentTags = this.taskForm.get('tags')?.value || [];
    const index = currentTags.indexOf(tag);
    
    if (index >= 0) {
      const updatedTags = [...currentTags];
      updatedTags.splice(index, 1);
      this.taskForm.get('tags')?.setValue(updatedTags);
      this.cdr.markForCheck();
    }
  }
}