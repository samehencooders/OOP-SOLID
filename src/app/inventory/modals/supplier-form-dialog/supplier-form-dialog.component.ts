// supplier-dialog.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Supplier } from '../../models/supplier.model';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-supplier-form-dialog',
  templateUrl: './supplier-form-dialog.component.html',
  styleUrls: ['./supplier-form-dialog.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 })),
      ]),
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(10px)', opacity: 0 }),
        animate(
          '300ms ease-out',
          style({ transform: 'translateY(0)', opacity: 1 })
        ),
      ]),
    ]),
  ],
})
export class SupplierFormDialogComponent implements OnInit {
  supplierForm: FormGroup;
  isEditMode: boolean;
  dialogTitle: string;
  maxRating = 5;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SupplierFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Partial<Supplier>
  ) {
    this.isEditMode = !!data.id;
    this.dialogTitle = this.isEditMode ? 'Edit Supplier' : 'Add Supplier';

    this.supplierForm = this.fb.group({
      id: [data.id || ''],
      name: [data.name || '', [Validators.required, Validators.maxLength(100)]],
      contactPerson: [data.contactPerson || '', Validators.maxLength(100)],
      email: [data.email || '', [Validators.email, Validators.maxLength(100)]],
      phone: [data.phone || '', Validators.maxLength(20)],
      address: this.fb.group({
        street: [data.address?.street || '', Validators.maxLength(100)],
        city: [data.address?.city || '', Validators.maxLength(50)],
        state: [data.address?.state || '', Validators.maxLength(50)],
        zipCode: [data.address?.zipCode || '', Validators.maxLength(20)],
        country: [data.address?.country || '', Validators.maxLength(50)],
      }),
      website: [data.website || '', Validators.maxLength(150)],
      taxId: [data.taxId || '', Validators.maxLength(30)],
      paymentTerms: [data.paymentTerms || '', Validators.maxLength(100)],
      leadTime: [
        data.leadTime || 0,
        [Validators.required, Validators.min(0), Validators.max(365)],
      ],
      minimumOrderQuantity: [
        data.minimumOrderQuantity || 0,
        [Validators.min(0)],
      ],
      notes: [data.notes || '', Validators.maxLength(1000)],
      rating: [data.rating || 0, [Validators.min(0), Validators.max(5)]],
      isActive: [data.isActive !== undefined ? data.isActive : true],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.supplierForm.invalid) {
      this.markFormGroupTouched(this.supplierForm);
      return;
    }

    const supplierData = this.supplierForm.value;

    if (!this.isEditMode) {
      // For new suppliers
      delete supplierData.id;
      supplierData.createdAt = new Date();
      supplierData.updatedAt = new Date();
    } else {
      // For existing suppliers
      supplierData.updatedAt = new Date();
    }

    this.dialogRef.close(supplierData);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  // Helper method to mark all controls as touched
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Rating stars display for the slider
  getStarsDisplay(): string {
    const rating = this.supplierForm.get('rating')?.value || 0;
    const fullStars = '★'.repeat(Math.floor(rating));
    const emptyStars = '☆'.repeat(5 - Math.floor(rating));
    return `${fullStars}${emptyStars}`;
  }

  // Helper method to check if a form control has a specific error
  hasError(controlName: string, errorName: string): boolean {
    const control = this.supplierForm.get(controlName);
    return control
      ? control.hasError(errorName) && (control.dirty || control.touched)
      : false;
  }

  // Helper method for nested form groups
  hasNestedError(
    groupName: string,
    controlName: string,
    errorName: string
  ): boolean {
    const group = this.supplierForm.get(groupName) as FormGroup;
    if (!group) return false;

    const control = group.get(controlName);
    return control
      ? control.hasError(errorName) && (control.dirty || control.touched)
      : false;
  }

  // Getters for form controls to use in template
  get nameControl() {
    return this.supplierForm.get('name');
  }
  get emailControl() {
    return this.supplierForm.get('email');
  }
  get leadTimeControl() {
    return this.supplierForm.get('leadTime');
  }
  get minimumOrderQuantityControl() {
    return this.supplierForm.get('minimumOrderQuantity');
  }

  // Form validation status
  isFormValid(): boolean {
    return this.supplierForm.valid;
  }

  // Reset the form
  resetForm(): void {
    this.supplierForm.reset({
      isActive: true,
      rating: 0,
      leadTime: 0,
      minimumOrderQuantity: 0,
    });

    // Reset address subgroup
    const addressGroup = this.supplierForm.get('address') as FormGroup;
    addressGroup.reset();
  }
}
