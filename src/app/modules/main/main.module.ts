import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { CoreModule } from '../core/core.module';
import { TestComponent } from './components/test/test.component';
import { EmployeeTableComponent } from './components/summary-tables/employee-table/employee-table.component';
import { EmployeePersonalInfoFormComponent } from './components/forms/employee/employee-personal-info-form/employee-personal-info-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanyDetailsComponent } from './components/forms/company-details/company-details.component';

@NgModule({
  declarations: [
    TestComponent,
    EmployeeTableComponent,
    EmployeePersonalInfoFormComponent,
    CompanyDetailsComponent,
  ],
  imports: [
    CommonModule,
    CoreModule,
    MainRoutingModule,
    SharedModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatTabsModule,
    MatIconModule,
    MatDividerModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class MainModule {}
