import { HttpClient } from '@angular/common/http';
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
import {
  InventoryItem,
  InventoryItemModel,
} from '../models/inventory-item.model';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private apiUrl = `${environment.apiUrl}/inventory`;
  private inventorySubject = new BehaviorSubject<InventoryItem[]>([]);
  public inventoryObservable$ = this.inventorySubject.asObservable();
  constructor(private http: HttpClient) {}

  loadInventoryItems(): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(this.apiUrl).pipe(
      map((items) => items.map((item) => new InventoryItemModel(item))),
      tap((items) => this.inventorySubject.next(items)),
      catchError((err) => {
        console.error(`Failed to load Inventory List :${err}`);
        return throwError(() => new Error(`Failed to load inventory list`));
      })
    );
  }
  getInventoryItem(id: string): Observable<InventoryItem> {
    return this.http.get<InventoryItem>(`${this.apiUrl}/${id}`).pipe(
      map((inventory) => new InventoryItemModel(inventory)),
      catchError((err) => {
        console.error(
          `an error occur while fetching Inventory with Id : ${id} `
        );
        return throwError(
          () => new Error(`an error while fetching the inventory with id ${id}`)
        );
      })
    );
  }

  createInventoryItem(item: Partial<InventoryItem>): Observable<InventoryItem> {
    return this.http.post<InventoryItem>(`${this.apiUrl}/create`, item).pipe(
      map((inventory) => new InventoryItemModel(inventory)),
      tap((inventory) => {
        const currentInventories = this.inventorySubject.value;
        console.log(currentInventories);
        this.inventorySubject.next([...currentInventories, inventory]);
      }),
      catchError((err) => {
        console.error(`An Error while adding new inventory ${err}`);
        return throwError(
          () => new Error(`An Error while adding new inventory`)
        );
      })
    );
  }
  updateInventoryItem(
    id: string,
    item: Partial<InventoryItem>
  ): Observable<InventoryItem> {
    return this.http.put<InventoryItem>(`${this.apiUrl}/${id}`, item).pipe(
      map((inventory) => new InventoryItemModel(inventory)),
      tap((mappedInventory) => {
        const currentInventories = this.inventorySubject.value;
        const index = currentInventories.findIndex((x) => x.id === id);

        if (index > -1) {
          const updatedItems = [...currentInventories];
          updatedItems[index] = mappedInventory;
          this.inventorySubject.next(updatedItems);
        }
      }),
      catchError((err) => {
        console.error(
          `an error occur when updating inventory was name is :${item.name} `,
          err
        );
        return throwError(
          () =>
            new Error(
              `an Error occur while updating inventory with name ${item.name}`
            )
        );
      })
    );
  }
  deleteInventoryItem(id: string): void {
    this.http.delete<void>(this.apiUrl).pipe(
      tap(() => {
        const currentInventories = this.inventorySubject.value;
        console.log('Before spread operator', currentInventories);
        currentInventories.filter((x) => x.id !== id);
        this.inventorySubject.next([...currentInventories]);
        console.log('After spread operator>>>', currentInventories);
      }),
      catchError((err) => {
        console.error(
          `unexpected error error while deleting an inventory. Please check your network `,
          err
        );
        return throwError(
          () =>
            new Error(
              `an error occur when deleting an inventory. Please try again later`
            )
        );
      })
    );
  }
}
