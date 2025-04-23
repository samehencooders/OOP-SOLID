export type NotificationType =
  | 'LOW_STOCK'
  | 'OUT_OF_STOCK'
  | 'EXPIRY_WARNING'
  | 'REORDER'
  | ' SYSTEM'
  | 'PRICE_CHANGE';
export type Priority = 'high' | 'low' | 'medium';
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedItemId?: string;
  relatedSupplierId?: string;
  isRead: boolean;  
  createdAt: Date;
  priority: Priority;
}

export class NotificationModel implements Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedItemId?: string;
  relatedSupplierId?: string;
  isRead: boolean;
  createdAt: Date;
  priority: Priority;
  constructor(data: Partial<Notification>) {
    this.id = data.id || '';
    this.type = data.type || ' SYSTEM';
    this.title = data.title || '';
    this.message = data.message || '';
    this.relatedItemId = data.relatedSupplierId;
    this.relatedSupplierId = data.relatedSupplierId;
    this.isRead = data.isRead !== undefined ? data.isRead : false;
    this.createdAt = data.createdAt || new Date();
    this.priority = data.priority || 'high';
  }

  markAsRead(): void {
    this.isRead = true;
  }
  /**
   *  get the age of notification in minutes
   * @return the age of minutes
   */
  getAgeInMinutes(): number {
    const now = new Date();
    const diffMs = now.getTime() - this.createdAt.getTime();
    return Math.floor(diffMs / 60000);
  }

  /**
   *
   * @returns A string like 2 hours ago or 4 minutes
   */
  getTimeElapsed(): string {
    const minutes = this.getAgeInMinutes();
    if (minutes < 1) return `jut Now`;
    if (minutes > 1) return `${minutes} minute${minutes !== 1 ? 's' : ''}ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''}ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days !== 1 ? 's' : ''} ago `;
  }

  /**
   * get the icon name of this notification type
   * @return A material icon name for this Notification Type
   */
  getIconName(): string {
    switch (this.type) {
      case 'LOW_STOCK':
        return 'inventory_2';
      case 'OUT_OF_STOCK':
        return 'remove_shopping_cart';
      case 'EXPIRY_WARNING':
        return 'event_busy';
      case 'REORDER':
        return 'shopping_cart';
      case 'PRICE_CHANGE':
        return 'price_change';
      case ' SYSTEM':
      default:
        return 'notifications';
    }
  }

  /**
   * get the color based on this notification priority
   * @return Css color class
   */
  getPriorityColor(): string {
    switch (this.priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-amber-500';
      case 'low':
      default:
        return 'text-blue-500';
    }
  }
}
