import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestComponent } from './components/test/test.component';
import { DemoComponent } from './components/demo/demo.component';
import { LayoutComponent } from '../core/components/layout/layout.component';
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
