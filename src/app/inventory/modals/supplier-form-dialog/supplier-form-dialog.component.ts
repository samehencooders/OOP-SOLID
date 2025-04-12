import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Supplier, SupplierModel } from '../../models/supplier.model';

@Component({
  selector: 'app-supplier-form-dialog',
  templateUrl: './supplier-form-dialog.component.html',
  styleUrls: ['./supplier-form-dialog.component.scss']
})
export class SupplierFormDialogComponent implements OnInit {
  supplierForm: FormGroup;
  dialogTitle: string;
  isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SupplierFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { supplier: Supplier }
  ) {
    this.isEditMode = !!data?.supplier?.id;
    this.dialogTitle = this.isEditMode ? 'Edit Supplier' : 'Add New Supplier';
    
    this.supplierForm = this.fb.group({
      id: [data?.supplier?.id || ''],
      name: [data?.supplier?.name || '', [Validators.required]],
      contactPerson: [data?.supplier?.contactPerson || '', [Validators.required]],
      email: [data?.supplier?.email || '', [Validators.email]],
      phone: [data?.supplier?.phone || '', [Validators.pattern(/^[0-9\+\-\(\)\s]+$/)]],
      address: this.fb.group({
        street: [data?.supplier?.address?.street || ''],
        city: [data?.supplier?.address?.city || ''],
        state: [data?.supplier?.address?.state || ''],
        zipCode: [data?.supplier?.address?.zipCode || ''],
        country: [data?.supplier?.address?.country || '']
      }),
      website: [data?.supplier?.website || ''],
      taxId: [data?.supplier?.taxId || ''],
      paymentTerms: [data?.supplier?.paymentTerms || ''],
      leadTime: [data?.supplier?.leadTime || 0, [Validators.min(0)]],
      minimumOrderQuantity: [data?.supplier?.minimumOrderQuantity || 0, [Validators.min(0)]],
      notes: [data?.supplier?.notes || ''],
      rating: [data?.supplier?.rating || 0, [Validators.min(0), Validators.max(5)]],
      isActive: [data?.supplier?.isActive || true]
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.supplierForm.valid) {
      const formValue = this.supplierForm.value;
      const supplier = new SupplierModel(formValue);
      
      // Preserve creation date if editing
      if (this.isEditMode && this.data.supplier.createdAt) {
        supplier.createdAt = this.data.supplier.createdAt;
      }
      
      // Always update the updatedAt date
      supplier.updatedAt = new Date();
      
      this.dialogRef.close(supplier);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}