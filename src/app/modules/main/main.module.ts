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
import { AddressService } from './services/address.service';
import { ContactDetailsComponent } from './components/forms/contact-details/contact-details.component';
import { AddressComponent } from './components/forms/address/address.component';
import { EmergencyContactsTableComponent } from './components/summary-tables/emergency-contacts-table/emergency-contacts-table.component';
import { EmergencyContactComponent } from './components/forms/emergency-contact/emergency-contact.component';
import { EmergencyContactsService } from './services/emergency-contacts.service';
import { EducationalQualificationsTableComponent } from './components/summary-tables/educational-qualifications-table/educational-qualifications-table.component';
import { EducationalQualificationFormComponent } from './components/forms/educational-qualification-form/educational-qualification-form.component';
import { ProfessionalInformationComponent } from './components/forms/professional-information/professional-information.component';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { EmployeePersonalDetailsFormComponent } from './components/forms/employee-personal-details-form/employee-personal-details-form.component';
import { EmployeeVisaDetailsFormComponent } from './components/forms/employee-visa-details-form/employee-visa-details-form.component';
import { VisaDetailsTableComponent } from './components/summary-tables/visa-details-table/visa-details-table.component';
import { JoiningDetailsComponent } from './components/forms/joining-details/joining-details.component';
import { WorkExperienceTableComponent } from './components/summary-tables/work-experience-table/work-experience-table.component';
import { WorkExperienceFormComponent } from './components/forms/work-experience-form/work-experience-form.component';
import { CertificationTableComponent } from './components/summary-tables/certification-table/certification-table.component';
import { CertificationFormComponent } from './components/forms/certification-form/certification-form.component';
import { OptionalAddressComponent } from './components/forms/optional-address/optional-address.component';
import { MAT_DATE_FORMATS } from '@angular/material/core';

export const MY_FORMATS = {

  parse: {
    dateInput: 'DD/MM/YYYY',
  },

  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'DDD MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'DDDD MMMM YYYY',
  },

};

@NgModule({
  declarations: [
    TestComponent,
    EmployeeTableComponent,
    CompanyDetailsComponent,
    AlphabetOnlyDirective,
    EmployeeComponent,
    EmployeeInfoComponent,
    ContactDetailsComponent,
    AddressComponent,
    EmergencyContactsTableComponent,
    EmergencyContactComponent,
    EducationalQualificationsTableComponent,
    EducationalQualificationFormComponent,
    ProfessionalInformationComponent,
    EmployeePersonalDetailsFormComponent,
    EmployeeVisaDetailsFormComponent,
    VisaDetailsTableComponent,
    JoiningDetailsComponent,
    WorkExperienceTableComponent,
    WorkExperienceFormComponent,
    CertificationTableComponent,
    CertificationFormComponent,
    OptionalAddressComponent,
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
    AddressService,
    EmergencyContactsService,
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
  exports: [AlphabetOnlyDirective],
})
export class MainModule { }
