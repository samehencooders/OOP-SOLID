import { NgModule } from '@angular/core';
import { InventoryRoutingModule } from './inventory.routing';
import { SharedModule } from '../shared/shared.module';
import { InventoryListComponent } from './components/inventory-feature/inventory-list/inventory-list.component';

@NgModule({
  declarations: [
    InventoryListComponent
    
  ],
  imports: [InventoryRoutingModule, SharedModule,],


  
  providers: [],
})
export class InventoryModule {}
