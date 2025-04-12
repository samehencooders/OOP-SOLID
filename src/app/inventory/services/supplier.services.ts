import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  tap,
  throwError,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { Supplier, SupplierModel } from '../models/supplier.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  private apiUrl = `${environment.apiUrl}/suppliers`;
  private suppliersSubject = new BehaviorSubject<Supplier[]>([]);
  public suppliers$ = this.suppliersSubject.asObservable();
  constructor(private http: HttpClient) {
    this.loadSuppliers();
  }
  loadSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.apiUrl).pipe(
      map((suppliers) =>
        suppliers.map((supplier) => new SupplierModel(supplier))
      ),
      tap((suppliers) => this.suppliersSubject.next(suppliers)),
      catchError((error) => {
        console.error('Error Loading Suppliers', error);
        return throwError(() => new Error('Failed to Load Suppliers'));
      })
    );
  }
  getSupplier(id: string): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.apiUrl}/${id}`).pipe(
      map((supplier) => new SupplierModel(supplier)),
      catchError((error) => {
        console.error(`error Getting supplier with id: ${id}`);
        return throwError(
          () => new Error(`Filed to get Supplier with id:${id}`)
        );
      })
    );
  }
  createSupplier(supplier: Partial<Supplier>): Observable<Supplier> {
    return this.http.post<Supplier>(this.apiUrl, supplier).pipe(
      map((supplier) => new SupplierModel(supplier)),
      tap((newSupplier) => {
        const currentSuppliers = this.suppliersSubject.value;
        this.suppliersSubject.next([...currentSuppliers, newSupplier]);
      }),
      catchError((err) => {
        console.error(`Error To Create new Supplier`, err);
        return throwError(() => new Error(`Faild To Create a Supplier ${err}`));
      })
    );
  }
  updateSupplier(
    id: string,
    supplier: Partial<Supplier>
  ): Observable<Supplier> {
    return this.http.put<Supplier>(`${this.apiUrl}/${id}`, supplier).pipe(
      map((updateSupplier) => new SupplierModel(updateSupplier)),
      tap((updatedSupplier) => {
        const currentSuppliers = this.suppliersSubject.value;
        const index = currentSuppliers.findIndex((x) => x.id === id);
        if (index < -1) {
          const updatedSuppliers = [...currentSuppliers];
          updatedSuppliers[index] = updatedSupplier;
          this.suppliersSubject.next(updatedSuppliers);
        }
      }),
      catchError((err) => {
        console.error(
          `An Error when Updating the Supplier With id:${supplier.id}`
        );
        return throwError(
          () =>
            new Error(`An Errored Occurd and Catched with RXJS Operator${err}`)
        );
      })
    );
  }
  deleteSupplier(id: string): Observable<any> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const currentSuppliers = this.suppliersSubject.value;
        this.suppliersSubject.next(currentSuppliers.filter((x) => x.id !== id));
      }),
      catchError((err) => {
        console.error(`an Error Occurd when Deleting Supplier With Id :`, id);
        return throwError(() => {
          new Error(
            `An Error Catched With RXJS Operator , check Supplier Error with ID:${id}`
          );
        });
      })
    );
  }
  searchSupplier(query: string): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${this.apiUrl}/search?q=${query}`).pipe(
      map((suppliers) =>
        suppliers.map((supplier) => new SupplierModel(supplier))
      ),
      catchError((err) => {
        console.error(`Failed to Search `, err);
        return throwError(
          () => new Error(`Failed To Get Filtered Suppliers, ${err}`)
        );
      })
    );
  }
  getTopRatedSuppliers(): Observable<Supplier[]> {
    return this.suppliers$.pipe(
      map((suppliers) => [...suppliers].sort((a, b) => b.rating - a.rating))
    );
  }
  getActiveSuppliers(): Observable<Supplier[]> {
    return this.suppliers$.pipe(
      map((suppliers) => suppliers.filter((x) => x.isActive))
    );
  }
  getSuppliersWithLeadTimeLessThan(days: number): Observable<Supplier[]> {
    return this.suppliers$.pipe(
      map((suppliers) =>
        suppliers.filter((supplier) => supplier.leadTime <= days)
      )
    );
  }
}
