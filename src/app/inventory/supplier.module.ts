import { NgModule } from '@angular/core';
import { SupplierListComponent } from './components/supplier-list/supplier-list.component';
import { SupplierRoutingModule } from './supplier-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SupplierFormDialogComponent } from './modals/supplier-form-dialog/supplier-form-dialog.component';

@NgModule({
  declarations: [SupplierListComponent , SupplierFormDialogComponent],
  imports: [SupplierRoutingModule ,SharedModule],
  providers: [],
})
export class SupplierModule {}
