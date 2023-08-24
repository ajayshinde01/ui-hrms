import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../core/components/layout/layout.component';
import { LoginComponent } from '../core/components/login/login.component';
import { EmployeeTableComponent } from './components/summary-tables/employee-table/employee-table.component';

const routes: Routes = [
  {
    path: '',

    redirectTo: 'demo',

    pathMatch: 'full',
  },
  {
    path: '',
    component: LayoutComponent,
    children: [{ path: 'employee', component: EmployeeTableComponent }],
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
