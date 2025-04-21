export interface Category {
  id: string;
  name: string;
  description: string;
  parentCategoryId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export class CategoryModel {
  id: string;
  name: string;
  description: string;
  parentCategoryId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  constructor(category: Partial<Category>) {
    this.id = category.id || '';
    this.name = category.name || '';
    this.description = category.description || '';
    this.parentCategoryId = category.parentCategoryId;
    this.isActive = category.isActive ?? true;
    this.createdAt = category.createdAt || new Date();
    this.updatedAt = category.updatedAt || new Date();
  }
  isToplevel(): boolean {
    return !this.parentCategoryId;
  }
}
