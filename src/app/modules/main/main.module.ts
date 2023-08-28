import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { CoreModule } from '../core/core.module';
import { TestComponent } from './components/test/test.component';
import { EmployeeTableComponent } from './components/summary-tables/employee-table/employee-table.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanyDetailsComponent } from './components/forms/company-details/company-details.component';
import { AlphabetOnlyDirective } from './components/forms/directives/alphabet-only.directive';
import { EmployeeComponent } from './components/forms/employee/employee.component';
import { EmployeeInfoComponent } from './components/forms/employee-info/employee-info.component';
import { CompanyDetailsService } from './services/company-details.service';
import { DesignationService } from '../master/services/designation.service';
import { RoleService } from '../master/services/role.service';
import { GradeService } from '../master/services/grade.service';
import { DivisionService } from './services/division.service';
import { EmployeeTypeService } from '../master/services/employee-type.service';
import { DepartmentService } from '../master/services/department.service';
import { EducationalQualificationsTableComponent } from './components/summary-tables/educational-qualifications-table/educational-qualifications-table.component';
import { EducationalQualificationFormComponent } from './components/forms/educational-qualification-form/educational-qualification-form.component';
import { ProfessionalInformationComponent } from './components/forms/professional-information/professional-information.component';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    TestComponent,
    EmployeeTableComponent,
    CompanyDetailsComponent,
    AlphabetOnlyDirective,
    EmployeeComponent,
    EmployeeInfoComponent,
    EducationalQualificationsTableComponent,
    EducationalQualificationFormComponent,
    ProfessionalInformationComponent,
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
    MatDialogModule,
    HttpClientModule,
  ],
  providers: [
    CompanyDetailsService,
    DesignationService,
    RoleService,
    GradeService,
    RoleService,
    EmployeeTypeService,
    DivisionService,
    DepartmentService,
  ],
  exports: [AlphabetOnlyDirective],
})
export class MainModule {}
