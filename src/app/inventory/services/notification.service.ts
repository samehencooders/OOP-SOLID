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
import { NotificationModel, Notification } from '../models/notification.model';
import { InventoryItem } from '../models/inventory-item.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private apiUrl = environment.apiUrl;
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();
  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadAllNotifications();
  }
  /**
   * load all notifications from an api
   * @returns observable of notifications array
   */
  loadAllNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.apiUrl).pipe(
      map((notifications) =>
        notifications.map((notification) => new NotificationModel(notification))
      ),
      tap((notifications) => {
        this.notificationsSubject.next(notifications);
        //   this.updatedUnreadCount(notifications)
      }),
      catchError((err) => {
        console.error(`an Error Occur `);
        return throwError(() => {
          console.error(`check again please `);
          return new Error(err);
        });
      })
    );
  }
  /**
   * load Notification rely on a given id
   * @param id the notification id
   * @returns Observable of Notification
   */
  getNotification(id: string): Observable<Notification> {
    return this.http.get<Notification>(`${this.apiUrl}/${id}`).pipe(
      map((notification) => new NotificationModel(notification)),
      catchError((err) => {
        console.error(err);
        return throwError(
          () => new Error(`check the network connection${err}`)
        );
      })
    );
  }
  createNotification(
    notification: Partial<Notification>
  ): Observable<Notification> {
    return this.http.post<Notification>(`${this.apiUrl}`, notification).pipe(
      map((notification) => new NotificationModel(notification)),
      tap((notification) => {
        const currentNotifications = this.notificationsSubject.value;
        const newNotifications = [...currentNotifications, notification];
        this.notificationsSubject.next(newNotifications);
        // this.updateUnreadCount(newNotifications);
      }),
      catchError((err) => {
        console.error(`an error occur , please check your network `);
        return throwError(() => {
          new Error(`an error from rxjs ${err}`);
        });
      })
    );
  }

  /**
   * mark notification as read based on passing id
   * @param id id for notification
   * @returns An updated notification after mark it as read
   */
  markNotificationAsRead(id: string): Observable<Notification> {
    return this.http.patch<Notification>(`${this.apiUrl}/${id}/read`, {}).pipe(
      map((updatedNotification) => new NotificationModel(updatedNotification)),
      tap((updatedNotification) => {
        const currentNotifications = this.notificationsSubject.value;
        const index = currentNotifications.findIndex((x) => x.id === id);
        if (index !== -1) {
          const updatedNotifications = [...currentNotifications];
          updatedNotifications[index] = updatedNotification;
          this.notificationsSubject.next(updatedNotifications);
          //   this.updateUnreadCount(updatedNotifications)
        }
      }),
      catchError((err) => {
        console.error('check Network Connection');
        return throwError(
          () => new Error(`an error from rxjs operators ${err}`)
        );
      })
    );
  }
  /**
   * mark all notifications as read
   * @returns observable of operation result
   */
  markAllAsRead(): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/mark-all-as-read`, {}).pipe(
      tap(() => {
        const currentNotifications = this.notificationsSubject.value;
        const updatedNotifications = currentNotifications.map(
          (notification) => {
            const updated = new NotificationModel(notification);
            updated.isRead = true;
            return updated;
          }
        );
        this.notificationsSubject.next(updatedNotifications);
        this.unreadCountSubject.next(0);
      }),
      catchError((err) => {
        console.error(`an error occur from console`);
        return throwError(
          () => new Error(`an error from rxjs operators ${err}`)
        );
      })
    );
  }
  /**
   * delete a notification based on id
   * @param id notification Id
   * @returns Observable of operation result
   */
  deleteNotification(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const currentNotifications = this.notificationsSubject.value;
        const updatedNotifications = currentNotifications.filter(
          (x) => x.id !== id
        );
        this.notificationsSubject.next(updatedNotifications);
        // this.updateUnreadCount(updatedNotifications)
      }),
      catchError((err) => {
        console.error(`an error from network`);
        return throwError(
          () => new Error(`an error from rxjs operators ${err}`)
        );
      })
    );
  }

  /**
   * get unread notifications
   * @returns Observable of unread notifications
   */
  getUnreadNotification(): Observable<Notification[]> {
    return this.notifications$.pipe(
      map((notifications) =>
        notifications.filter((notification) => {
          !notification.isRead;
        })
      )
    );
  }

  /**
   * create a low notification that low on stock
   * @param inventory the inventory item that low on stock
   * @returns the Observable of created notification
   */
  createLowStockNotification(
    inventory: InventoryItem
  ): Observable<Notification> {
    const notification: Partial<Notification> = {
      type: 'LOW_STOCK',
      title: 'Low Stock Alert',
      message: `${inventory.name} is running low on stock , current Stock ${inventory.currentStock} ,  minimum stock ${inventory.minimumStock}`,
      relatedItemId: inventory.id,
      priority: 'low',
      isRead: false,
    };
    return this.createNotification(notification);
  }
  /**
   * create an expiry warning of an inventory intem
   * @param inventory an item with a expiry warning
   * @param daysUntilExpiry number until expiry
   * @returns an Observable of notification
   */
  createExpiryWarningNotification(
    inventory: InventoryItem,
    daysUntilExpiry: number
  ): Observable<Notification> {
    const notification: Partial<Notification> = {
      type: 'EXPIRY_WARNING',
      title: 'Expiry Warning',
      message: `${inventory.name} will expire in ${daysUntilExpiry} `,
      relatedItemId: inventory.id,
      priority: daysUntilExpiry <= 7 ? 'high' : 'low',
      isRead: false,
    };
    return this.createNotification(notification);
  }
}
