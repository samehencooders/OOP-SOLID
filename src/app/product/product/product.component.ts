import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  products: Product[] | Observable<Product[]> = [];
  selectedProduct: Product | null = null;
  constructor(private _productService: ProductService) {}
  ngOnInit(): void {
    this.getProducts();
  }
  private getProducts(): void {
    this.products = this._productService.getProducts();
  }
  onProductSelected(product: Product): void {
    this.selectedProduct = product;
  }
}
