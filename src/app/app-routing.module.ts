import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskDetailsComponent } from './kanban-board/pages/task-details/task-details.component';

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'task-board',
    loadChildren: () =>
      import('./kanban-board/kanban-board.module').then(
        (m) => m.KanbanBoardModule
      ),
  },
  {
    path: 'task-board-kanban',
    loadChildren: () =>
      import('./task-board/task-board.module').then(
        (m) => m.TaskBoardModule
      ),
  },
  { 
    path: 'task/:id', 
    component: TaskDetailsComponent 
  },
  {
    path: 'inventory',
    loadChildren: () =>
      import('./inventory/inventory.module').then((m) => m.InventoryModule),
  },

  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
