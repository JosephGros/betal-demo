import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Supplier } from '../../models/supplier.model';
import { SupplierService } from '../../services/supplier.service';

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './supplier-list.html',
})
export class SupplierListComponent implements OnInit {
  suppliers = signal<Supplier[]>([]);
  loading = signal(false);
  error = signal('');

  constructor(private supplierService: SupplierService) {}

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.loading.set(true);
    this.error.set('');

    this.supplierService.getSuppliers().subscribe({
      next: (suppliers) => {
        console.log('SUPPLIERS IN COMPONENT:', suppliers);

        this.suppliers.set(suppliers);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('SUPPLIER LIST ERROR:', error);

        this.error.set('Kunde inte hämta leverantörer.');
        this.loading.set(false);
      },
    });
  }
}
