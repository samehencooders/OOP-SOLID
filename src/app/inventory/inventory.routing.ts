import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryListComponent } from './components/inventory-list/inventory-list.component';

const routes: Routes = [
  {
    path: '',
    component: InventoryListComponent,
  },
  {
    path: 'suppliers',
    loadChildren: () =>
      import('./components/supplier-list/supplier.module').then(
        (m) => m.SupplierModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryRoutingModule {}
