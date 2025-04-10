import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductComponent } from './product/product.component';
import { ProductService } from './services/product.service';
import { ApiProductService } from './services/api-product.service';
import { RouterModule } from '@angular/router';
const router = [
  {
    path: '',
    component: ProductComponent,
  },
];
@NgModule({
  declarations: [ProductListComponent, ProductComponent],
  exports: [ProductComponent],
  imports: [CommonModule, RouterModule.forChild(router)],
  providers: [{ provide: ProductService, useClass: ApiProductService }],
})
export class ProductModule {}
