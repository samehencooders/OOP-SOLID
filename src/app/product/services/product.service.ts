import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { Observable } from 'rxjs';

const DUMMY_PRODUCTS: Product[] = [
  new Product(1, 'Product 1', 100, 'Product 1 description'),
  new Product(2, 'Product 2', 200, 'Product 2 description'),
  new Product(3, 'Product 3', 300, 'Product 3 description'),
  new Product(4, 'Product 4', 400, 'Product 4 description'),
  new Product(5, 'Product 5', 500, 'Product 5 description'),
  new Product(6, 'Product 6', 600, 'Product 6 description'),
  new Product(7, 'Product 7', 700, 'Product 7 description'),
  new Product(8, 'Product 8', -800, 'Product 8 description'),
];

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  getProducts(): Product[] | Observable<Product[]> {
    return DUMMY_PRODUCTS;
  }

  getProductById(id: number): Product | undefined {
    return DUMMY_PRODUCTS.find((x) => x.id === id);
  }
}
