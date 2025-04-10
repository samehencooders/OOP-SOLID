import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from '../models/product.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  @Input() products: any = [];
  @Output() productSelected = new EventEmitter<Product>();
  constructor() {}

  ngOnInit(): void {
    console.log(this.products);
  }
  onSelectProduct(product: Product) {
    this.productSelected.emit(product);
  }
}
