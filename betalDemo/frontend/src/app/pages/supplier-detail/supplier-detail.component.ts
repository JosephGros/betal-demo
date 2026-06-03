import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaymentStatus, Supplier } from '../../models/supplier.model';
import { SupplierService } from '../../services/supplier.service';

@Component({
  selector: 'app-supplier-detail',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './supplier-detail.html',
})
export class SupplierDetailComponent implements OnInit {
  private formBuilder = inject(FormBuilder);

  supplier = signal<Supplier | null>(null);
  loading = signal(false);
  savingPayment = signal(false);
  error = signal('');
  paymentError = signal('');
  supplierId = signal<string | null>(null);
  showPaymentForm = signal(false);

  paymentForm = this.formBuilder.nonNullable.group({
    amount: [0, [Validators.required, Validators.min(1)]],
    reference: ['', Validators.required],
    currency: ['SEK'],
    status: ['PENDING' as PaymentStatus],
  });

  constructor(
    private route: ActivatedRoute,
    private supplierService: SupplierService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    this.supplierId.set(id);

    if (!id) {
      this.error.set('Saknar leverantörs-id.');
      return;
    }

    this.loadSupplier(id);
  }

  loadSupplier(id: string): void {
    this.loading.set(true);
    this.error.set('');
    this.supplier.set(null);

    this.supplierService.getSupplier(id).subscribe({
      next: (supplier) => {
        if (!supplier) {
          this.error.set('Leverantören hittades inte.');
          this.loading.set(false);
          return;
        }

        this.supplier.set(supplier);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('DETAIL ERROR:', error);
        this.error.set('Kunde inte hämta leverantören.');
        this.loading.set(false);
      },
    });
  }

  openPaymentForm(): void {
    this.showPaymentForm.set(true);
  }

  closePaymentForm(): void {
    this.showPaymentForm.set(false);
    this.paymentError.set('');

    this.paymentForm.reset({
      amount: 0,
      reference: '',
      currency: 'SEK',
      status: 'PENDING' as PaymentStatus,
    });
  }

  onCreatePayment(): void {
    const id = this.supplierId();

    if (!id) {
      this.paymentError.set('Saknar leverantörs-id.');
      return;
    }

    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    this.savingPayment.set(true);
    this.paymentError.set('');

    this.supplierService
      .createPayment({
        supplierId: id,
        ...this.paymentForm.getRawValue(),
      })
      .subscribe({
        next: () => {
          this.savingPayment.set(false);
          this.showPaymentForm.set(false);

          this.paymentForm.reset({
            amount: 0,
            reference: '',
            currency: 'SEK',
            status: 'PENDING' as PaymentStatus,
          });

          this.loadSupplier(id);
        },
        error: (error) => {
          console.error('CREATE PAYMENT ERROR:', error);
          this.paymentError.set('Kunde inte skapa betalning.');
          this.savingPayment.set(false);
        },
      });
  }
}
