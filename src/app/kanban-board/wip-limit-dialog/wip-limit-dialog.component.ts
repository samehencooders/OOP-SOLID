import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-wip-limit-dialog',
  templateUrl: './wip-limit-dialog.component.html',
  styleUrls: ['./wip-limit-dialog.component.scss']
})
export class WipLimitDialogComponent {
  wipForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<WipLimitDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: string, currentLimit: number }
  ) {
    this.wipForm = this.fb.group({
      limit: [data.currentLimit, [Validators.required, Validators.min(1), Validators.max(20)]]
    });
  }

  onSubmit(): void {
    if (this.wipForm.valid) {
      this.dialogRef.close(this.wipForm.value.limit);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}