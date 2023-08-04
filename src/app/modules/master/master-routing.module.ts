import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../core/components/layout/layout.component';
import { EmployeeTypeComponent } from './components/forms/employee-type-form/employee-type.component';
import { EmployeeTypeTableComponent } from './components/summary-tables/employee-type-table/employee-type-table.component';
import { DivisionComponent } from './components/forms/division-form/division.component';
import { DivisionTableComponent } from './components/summary-tables/division-table/division-table.component';
import { DepartmentComponent } from './components/forms/department-form/department.component';
import { DepartmentTableComponent } from './components/summary-tables/department-table/department-table.component';



const routes: Routes = [
  {
    path: '',
    redirectTo: 'master',
    pathMatch: 'full',
  },

 
  {
    path: '',
    component: LayoutComponent,
    children: [{ path: 'employee-type', component: EmployeeTypeComponent }],
  },
  {
    path: '',
    component: LayoutComponent,
    children: [{ path: 'employee-table', component: EmployeeTypeTableComponent }],
  },
  {
    path: '',
    component: LayoutComponent,
    children: [{ path: 'division', component: DivisionComponent }],
  },
  {
    path: '',
    component: LayoutComponent,
    children: [{ path: 'division-table', component: DivisionTableComponent }],
  },
  {
    path: '',
    component: LayoutComponent,
    children: [{ path: 'department', component: DepartmentComponent }],
  },
  {
    path: '',
    component: LayoutComponent,
    children: [{ path: 'department-table', component: DepartmentTableComponent }],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterRoutingModule {}
