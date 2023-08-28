import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../core/components/layout/layout.component';
import { LoginComponent } from '../core/components/login/login.component';
import { EmployeeTableComponent } from './components/summary-tables/employee-table/employee-table.component';
import { EmployeeInfoComponent } from './components/forms/employee-info/employee-info.component';
import { EmployeeComponent } from './components/forms/employee/employee.component';
import { VisaDetailsTableComponent } from './components/summary-tables/visa-details-table/visa-details-table.component';

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
      { path: 'employee-info', component: EmployeeComponent }
    ],
  },
  {
    path: '',
    component: LayoutComponent,
    children: [{ path: 'visa-table', component: VisaDetailsTableComponent }],
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
     
    ],
  },
  {
    path: '',
    component: LayoutComponent,
    children: [{ path: 'login', component: LoginComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
