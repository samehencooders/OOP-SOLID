import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskPlannerDashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: TaskPlannerDashboardComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskBoardRoutingModule { }