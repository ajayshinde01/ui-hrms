import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';

import { DemoComponent } from './components/demo/demo.component';
import { CoreModule } from '../core/core.module';
import { TestComponent } from './components/test/test.component';
import { EmployeeTableComponent } from './components/summary-tables/employee-table/employee-table.component';

@NgModule({
  declarations: [TestComponent, EmployeeTableComponent],
  imports: [CommonModule, CoreModule, MainRoutingModule, SharedModule],
})
export class MainModule {}
