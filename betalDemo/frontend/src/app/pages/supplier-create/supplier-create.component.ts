import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupplierService } from '../../services/supplier.service';
import { RiskStatus } from '../../models/supplier.model';

@Component({
  selector: 'app-supplier-create',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './supplier-create.html',
})
export class SupplierCreateComponent {
  private formBuilder = inject(FormBuilder);
  private supplierService = inject(SupplierService);
  private router = inject(Router);

  loading = false;
  error = '';

  form = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    organizationNumber: ['', Validators.required],
    riskStatus: ['UNKNOWN' as RiskStatus],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';

    this.supplierService.createSupplier(this.form.getRawValue()).subscribe({
      next: (supplier) => {
        if (!supplier) {
          this.error = 'Något gick fel när leverantören skapades.';
          this.loading = false;
          return;
        }

        this.loading = false;
        this.router.navigate(['/suppliers', supplier.id]);
      },
      error: () => {
        this.error = 'Kunde inte skapa leverantör.';
        this.loading = false;
      },
    });
  }
}
