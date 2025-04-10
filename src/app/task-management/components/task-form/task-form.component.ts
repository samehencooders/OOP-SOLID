import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskModel } from '../../models/task.model';
import { Priority } from '../../models/priority.enum';
import { Status } from '../../models/status.enum';
import { TaskService } from '../../services/task.service';
import { UpdateTask } from '../../models/update-task.interface';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
})
export class TaskFormComponent implements OnInit, OnChanges {
  @Input() task!: TaskModel | null;
  @Input() isCreateMode: boolean = true;
  @Output() save = new EventEmitter<UpdateTask>();
  @Output() cancel = new EventEmitter<void>();
  taskForm!: FormGroup;
  priorities = Object.values(Priority);
  statuses = Object.values(Status);

  constructor(private fb: FormBuilder, private _taskService: TaskService) {}

  ngOnInit(): void {
    this.initiateForm();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task']) {
      if (!this.task) {
        this.initiateForm();
        this.taskForm.reset();
      }
      this.initiateForm();
    }
  }
  initiateForm(): void {
    this.taskForm = this.fb.group({
      id: [this.task?.id || ''],
      title: [this.task?.title || '', Validators.required],
      description: [this.task?.description || '', Validators.required],
      dueDate: [this.task?.dueDate || '', Validators.required],
      priority: [this.task?.priority || '', Validators.required],
      status: [this.task?.status || '', Validators.required],
    });
  }
  onCancel() {}
  onSave() {
    const id = this.taskForm.controls['id']!.value;
    const updatedTask = this.taskForm.value;
    this.save.emit({ id: id, updatedTask: updatedTask });
  }
}
