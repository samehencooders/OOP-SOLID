import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'users',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
  },
  {
    path: 'products',
    loadChildren: () =>
      import('./product/product.module').then((m) => m.ProductModule),
  },
  {
    path: 'task-management',
    loadChildren: () =>
      import('./task-management/task-management.module').then((m) => m.TaskManagementModule),
  },
  {
    path: 'supplier', //replace it with inventory
    loadChildren: () =>
      import('./inventory/supplier.module').then((m) => m.SupplierModule),
  },
  // {
  //   path: 'dashbaord',
  //   loadChildren: () =>
  //     import('./analytics/analytics.module').then((m) => m.AnalyticsModule),
  // },
  { path: '', redirectTo: '/users', pathMatch: 'full' },
  { path: '**', redirectTo: '/users' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
