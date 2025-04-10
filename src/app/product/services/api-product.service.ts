import { Injectable } from '@angular/core';
import { ProductService } from './product.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';

const DUMMY_PRODUCTS: Product[] = [
  new Product(1, 'Product 1421', 1006453, 'Product 154265 description'),
  new Product(2, 'Product 2534', 2074560, 'Product 27456 description'),
  new Product(3, 'Product 36345', -3074560, 'Product 33456 description'),
  new Product(4, 'Product 1234', 4076540, 'Product 46345 description'),
  new Product(5, 'Product 13643565', 5045670, 'Product 2345 description'),
  new Product(6, 'Product 745676', 6023450, 'Product 67654 description'),
  new Product(7, 'Product 75867', 7234500, 'Product 5237 description'),
  new Product(8, 'Product 852345432', 8063450, 'Product 63458 description'),
];

@Injectable({
  providedIn: 'root',
})
export class ApiProductService extends ProductService {
  private baseUrl = 'https://api.example.com/products';
  constructor(private http: HttpClient) {
    super();
  }

  override getProducts(): Product[] {
    console.log('using override method and api service to fetch the products');
    return DUMMY_PRODUCTS;
    // return this.http.get<Product[]>(this.baseUrl);
  }

  override getProductById(id: number): Product | undefined {
    console.log(
      'using override method and api service to fetch the Product by id'
    );
    return DUMMY_PRODUCTS.filter((x) => x.id === id)[0];
    // return this.http.get<Product>(this.baseUrl);
  }
}
