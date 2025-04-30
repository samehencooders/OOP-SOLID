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
import {
  StockMovement,
  StockMovementModel,
} from '../models/stock-movement.model';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private apiUrl = `${environment.apiUrl}/inventory`;
  private inventorySubject = new BehaviorSubject<InventoryItem[]>([]);
  public inventoryObservable$ = this.inventorySubject.asObservable();
  constructor(private http: HttpClient) {}

  loadInventoryItems(): Observable<InventoryItemModel[]> {
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
  deleteInventoryItem(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap((inventoryItem) => {
        const currentInventories = this.inventorySubject.value;
        currentInventories.filter((x) => x.id !== id);
        console.log('before spread Operator >>', currentInventories);
        const updatedInventories = [...currentInventories];
        console.log('after spread Operator >>', currentInventories);
        this.inventorySubject.next(updatedInventories);
      }),
      catchError((err) => {
        console.error(`an error occured when deleting an inventory Item`);
        return throwError(
          () =>
            new Error(
              `an Error Occured when deleting an item with an id : ${id} , ${err}`
            )
        );
      })
    );
  }

  recordStockMovement(
    movement: Partial<StockMovement>
  ): Observable<StockMovement> {
    return this.http
      .post<StockMovement>(`${this.apiUrl}/${movement.id}/movements`, movement)
      .pipe(
        map((movement) => new StockMovementModel(movement)),
        tap((movement) => {
          console.log(movement);
          this.getInventoryItem(movement.inventoryItemId).subscribe((item) => {
            console.log('item is : >>', item);
            const inventory = item as InventoryItemModel;
            console.log(inventory);
            if (inventory.isLowOnStock()) {
              // this.notificationService.createLowStockNotification(item);
            }
          });
        }),
        catchError((err) => {
          console.error(`an error Occured `, err);
          return throwError(() => new Error(`Please Try again ${err}`));
        })
      );
  }
  getStockMovements(itemId: number): Observable<StockMovement[]> {
    return this.http
      .get<StockMovement[]>(`${this.apiUrl}/${itemId}/movements`)
      .pipe(
        map((movements) =>
          movements.map((movement) => new StockMovementModel(movement))
        ),
        catchError((err) => {
          console.error(err);
          return throwError(
            () => new Error(`an error occured , Please try again,  ${err}`)
          );
        })
      );
  }
  searchInventoryItems(query: string): Observable<InventoryItem[]> {
    return this.http
      .get<InventoryItem[]>(`${this.apiUrl}/search?q=${query}`)
      .pipe(
        map((items) => items.map((item) => new InventoryItemModel(item))),
        tap((item) => {
          console.log(`item after transformation`, item);
        }),
        catchError((err) => {
          console.error(
            `an error occurd from the server side Please try again later`
          );
          return throwError(() => new Error(err));
        })
      );
  }
  getLowStockItems(): Observable<InventoryItem[]> {
    return this.inventoryObservable$.pipe(
      map((items) =>
        items.filter((item) => {
          item.currentStock <= item.minimumStock;
        })
      )
    );
  }

  getOutOfStockItems(): Observable<InventoryItem[]> {
    return this.inventoryObservable$.pipe(
      map((items) => items.filter((x) => x.currentStock === 0))
    );
  }
  getItemsToReOrder(): Observable<InventoryItem[]> {
    return this.inventoryObservable$.pipe(
      map((items) =>
        items.filter((item) => item.currentStock <= item.reorderPoint)
      )
    );
  }
  getTotalInventoryValue(): Observable<number> {
    return this.inventoryObservable$.pipe(
      map((items) =>
        items.reduce((total, item) => total + item.price * item.currentStock, 0)
      )
    );
  }

  scanCode(code: string): Observable<InventoryItem | null> {
    return this.inventoryObservable$.pipe(
      map((items) => {
        const item = items.find((x) => x.barcode === code || x.qrCode === code);
        return item ? new InventoryItemModel(item) : null;
      })
    );
  }
}
