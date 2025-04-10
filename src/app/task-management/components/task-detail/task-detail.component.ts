import { Component, Input, OnInit } from '@angular/core';
import { TaskModel } from '../../models/task.model';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss'],
})
export class TaskDetailComponent implements OnInit {
  @Input() task: TaskModel | null = null;
  constructor() {}

  ngOnInit(): void {}
}
