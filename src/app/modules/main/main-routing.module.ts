import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../core/components/layout/layout.component';

import { EmployeeTableComponent } from './components/summary-tables/employee-table/employee-table.component';
import { EmployeePersonalInfoFormComponent } from './components/forms/employee/employee-personal-info-form/employee-personal-info-form.component';

const routes: Routes = [
  {
    path: '',

    redirectTo: 'main',

    pathMatch: 'full',
  },
  {
    path: '',
    component: LayoutComponent,
    children: [{ path: 'employee-table', component: EmployeeTableComponent }],
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'employee-form', component: EmployeePersonalInfoFormComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
