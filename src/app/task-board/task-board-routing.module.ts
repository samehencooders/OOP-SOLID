import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskPlannerDashboardComponent } from './dashboard/dashboard.component';
import { TaskBoardComponent } from './task-board/task-board.component';

const routes: Routes = [
  {
    path: '',
    component: TaskPlannerDashboardComponent
  },
  {
    path: 'board',
    component: TaskBoardComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskBoardRoutingModule { }