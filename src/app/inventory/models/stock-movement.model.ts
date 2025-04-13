export type MovementType = 'IN' | 'OUT' | 'ADJUSTMENT' | 'TRANSFER';

export interface StockMovement {
  id: string;
  inventoryItemId: string;
  type: MovementType;
  quantity: number;
  uniCost: number;
  totalCost: number;
  reference: string;
  performedBy: string;
  timestamp: Date;
  locationFrom?: string;
  locationTo?: string;
}
export class StockMovementModel implements StockMovement {
  id: string;
  inventoryItemId: string;
  type: MovementType;
  quantity: number;
  uniCost: number;
  totalCost: number;
  reference: string;
  performedBy: string;
  timestamp: Date;
  locationFrom?: string;
  locationTo?: string;
  constructor(movement: Partial<StockMovement>) {
    this.id = movement.id || '';
    this.inventoryItemId = movement.inventoryItemId || '';
    this.type = movement.type || 'ADJUSTMENT';
    this.quantity = movement.quantity || 0;
    this.uniCost = movement.uniCost || 0;
    this.totalCost = movement.totalCost || 0;
    this.reference = movement.reference || '';
    this.performedBy = movement.performedBy || '';
    this.timestamp = movement.timestamp || new Date();
    this.locationFrom = movement.locationFrom;
    this.locationTo = movement.locationTo;
  }
  calculateTotalCost(): number {
    return this.quantity * this.uniCost;
  }
  getDescription(): string {
    switch (this.type) {
      case 'IN':
        return `Received ${this.quantity}units`;
      case 'OUT':
        return `Removed ${this.quantity} units`;
      case 'ADJUSTMENT':
        return `Adujsted by ${this.quantity > 0 ? '+' : ''}${
          this.quantity
        } units`;
      case 'TRANSFER':
        return `Transferred ${this.quantity} units from ${this.locationFrom} to ${this.locationTo}`;
      default:
        return `Mofied stock by ${this.quantity} units`;
    }
  }
  isPositiveMovement(): boolean {
    return this.type === "IN" ||( this.type === "ADJUSTMENT" && this.quantity > 0)
  }
  isNegativeMovement():boolean { 
    return this.type === "OUT" || (this.type === "ADJUSTMENT" && this.quantity < 0)
  }
}
