export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  emial: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  website: string;
  taxId: string;
  paymentTerms: string;
  leadTime: number;
  minimumOrderQuantity: number;
  notes: string;
  rating: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export class SupplierModel implements Supplier {
  id: string;
  name: string;
  contactPerson: string;
  emial: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  website: string;
  taxId: string;
  paymentTerms: string;
  leadTime: number;
  minimumOrderQuantity: number;
  notes: string;
  rating: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  constructor(supplier: Partial<Supplier>) {
    this.id = supplier.id || '';
    this.name = supplier.name || '';
    this.contactPerson = supplier.contactPerson || '';
    this.emial = supplier.emial || '';
    this.phone = supplier.phone || '';
    this.address = supplier.address || {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    };
    this.website = supplier.website || '';
    this.taxId = supplier.taxId || '';
    this.paymentTerms = supplier.paymentTerms || '';
    this.leadTime = supplier.leadTime || 0;
    this.minimumOrderQuantity = supplier.minimumOrderQuantity || 0;
    this.notes = supplier.notes || '';
    this.rating = supplier.rating || 0;
    this.isActive = supplier.isActive || false;
    this.createdAt = supplier.createdAt || new Date();
    this.updatedAt = supplier.updatedAt || new Date();
  }

  getFullAddress(): string {
    return `${this.address.street}, ${this.address.city} , ${this.address.state}, ${this.address.zipCode}, ${this.address.country}`;
  }

  hasValidContractInfo(): boolean {
    return Boolean(this.emial || this.phone);
  }
  getDisplayRating(): string {
    const fullStars = '★'.repeat(Math.floor(this.rating));
    const emptyStarts = '☆'.repeat(5 - Math.floor(this.rating));
    return `${fullStars}${emptyStarts}`;
  }
}
