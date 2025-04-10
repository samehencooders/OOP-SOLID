import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Status } from '../../models/status.enum';
import { Priority } from '../../models/priority.enum';

@Component({
  selector: 'app-task-filter',
  templateUrl: './task-filter.component.html',
  styleUrls: ['./task-filter.component.scss'],
})
export class TaskFilterComponent implements OnInit {
  @Output() statusChange = new EventEmitter<Status>();
  @Output() priorityChange = new EventEmitter<Priority>();
  statuses = Object.values(Status);
  priorities = Object.values(Priority);
  constructor() {}

  ngOnInit(): void {}
  onStatusChange(status: any) {
    this.statusChange.emit(status.value as Status);
  }
  onPriorityChange(priority: any) {
    this.priorityChange.emit(priority.value as Priority);
  }
}
