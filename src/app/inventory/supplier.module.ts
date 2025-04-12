import { NgModule } from '@angular/core';
import { SupplierListComponent } from './components/supplier-list/supplier-list.component';
import { SupplierRoutingModule } from './supplier-routing.module';
import { SharedModule } from '../shared.module';

@NgModule({
  declarations: [SupplierListComponent],
  imports: [SupplierRoutingModule ,SharedModule],
  providers: [],
})
export class SupplierModule {}
