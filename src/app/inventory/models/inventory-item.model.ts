import { Category } from './category.model';
import { StockMovement } from './stock-movement.model';
import { Supplier } from './supplier.model';

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: Category;
  price: number;
  cost: number;
  currentStock: number;
  minimumStock: number;
  reorderPoint: number;
  location: string;
  suppliers: Supplier[];
  stockMovement: StockMovement[];
  barcode: string;
  qrCode: string;
  imageUrl: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  expiryDate?: Date;
  isActive: boolean;
}
export class InventoryItemModel implements InventoryItem {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: Category;
  price: number;
  cost: number;
  currentStock: number;
  minimumStock: number;
  reorderPoint: number;
  location: string;
  suppliers: Supplier[];
  stockMovement: StockMovement[];
  barcode: string;
  qrCode: string;
  imageUrl: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  constructor(item: Partial<InventoryItem>) {
    this.id = item.id || '';
    this.sku = item.sku || '';
    this.name = item.name || '';
    this.description = item.description || '';
    this.category = item.category || ({} as Category);
    this.price = item.price || 0;
    this.cost = item.cost || 0;
    this.currentStock = item.currentStock || 0;
    this.minimumStock = item.minimumStock || 0;
    this.reorderPoint = item.reorderPoint || 0;
    this.location = item.location || '';
    this.suppliers = item.suppliers || [];
    this.stockMovement = item.stockMovement || [];
    this.barcode = item.barcode || '';
    this.qrCode = item.qrCode || '';
    this.imageUrl = item.imageUrl || '';
    this.tags = item.tags || [];
    this.createdAt = item.createdAt || new Date();
    this.updatedAt = item.updatedAt || new Date();
    this.isActive = item.isActive ?? true;
  }
  getProfitMargin(): number {
    if (this.cost === 0) return 0;
    return ((this.price - this.cost) / this.price) * 100;
  }
  getTotalValue(): number {
    return this.price * this.currentStock;
  }
  isLowOnStock(): boolean {
    return this.currentStock <= this.minimumStock;
  }
  needReorder(): boolean {
    return this.currentStock <= this.reorderPoint;
  }
  getPreferredSupplier(): Supplier | null {
    return this.suppliers.length > 0 ? this.suppliers[0] : null;
  }
  getAverageCost(): number {
    if (this.stockMovement.length === 0) return this.cost;
    const incomingMovements = this.stockMovement.filter((m) => m.type === 'IN');
    if (incomingMovements.length === 0) return this.cost;
    const totalCost = incomingMovements.reduce(
      (sum, movement) => sum + movement.uniCost * movement.quantity,
      0
    );
    const totalQuantity = incomingMovements.reduce(
      (sum, movement) => sum + movement.quantity,
      0
    );
    return totalQuantity > 0 ? totalCost / totalQuantity : this.cost;
  }
}
