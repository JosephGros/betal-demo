import { Routes } from '@angular/router';
import { SupplierListComponent } from './pages/supplier-list/supplier-list.component';
import { SupplierDetailComponent } from './pages/supplier-detail/supplier-detail.component';
import { SupplierCreateComponent } from './pages/supplier-create/supplier-create.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'suppliers',
    pathMatch: 'full',
  },
  {
    path: 'suppliers',
    component: SupplierListComponent,
  },
  {
    path: 'suppliers/new',
    component: SupplierCreateComponent,
  },
  {
    path: 'suppliers/:id',
    component: SupplierDetailComponent,
  },
];
