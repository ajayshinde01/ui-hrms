import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatFormFieldControl,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MasterRoutingModule } from './master-routing.module';
import { DesignationComponent } from './components/summary-tables/designation/designation.component';
import { GradeComponent } from './components/summary-tables/grade/grade.component';
import { RoleFormComponent } from './components/forms/role-form/role.form.component';
import { DesignationService } from './services/designation.service';
import { GradeService } from './services/grade.service';
import { DesignationFormComponent } from './components/forms/designation-form/designation.form.component';
import { PopupComponent } from './components/helper/popup/popup.component';
import { GradeFormComponent } from './components/forms/grade-form/grade.form.component';
import { RoleComponent } from './components/summary-tables/role/role.table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoleService } from './services/role.service';
import { SharedModule } from '../shared/shared.module';
import { DepartmentTableComponent } from './components/summary-tables/department-table/department-table.component';
import { EmployeeTypeComponent } from './components/forms/employee-type-form/employee-type.component';
import { EmployeeTypeTableComponent } from './components/summary-tables/employee-type-table/employee-type-table.component';
import { DivisionComponent } from './components/forms/division-form/division.component';
import { DivisionTableComponent } from './components/summary-tables/division-table/division-table.component';
import { EmployeeTypeService } from './services/employee-type.service';
import { DivisionService } from './services/division.service';
import { DepartmentService } from './services/department.service';
import { ToastrModule } from 'ngx-toastr';
import { DepartmentComponent } from './components/forms/department-form/department.component';
import { DashboardComponent } from './components/summary-tables/dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
@NgModule({
  declarations: [
    DesignationComponent,
    GradeComponent,
    RoleComponent,
    RoleFormComponent,
    DesignationFormComponent,
    PopupComponent,
    GradeFormComponent,
    DepartmentComponent,
    DepartmentTableComponent,
    EmployeeTypeComponent,
    EmployeeTypeTableComponent,
    DivisionComponent,
    DivisionTableComponent,
    PopupComponent,
    DashboardComponent,
  ],
  entryComponents: [RoleFormComponent],
  imports: [
    CommonModule,
    MasterRoutingModule,
    SharedModule,
    MatFormFieldModule,
    HttpClientModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule,
    MatFormFieldModule,
    HttpClientModule,
  ],

  providers: [
    DesignationService,
    GradeService,
    RoleService,
    EmployeeTypeService,
    DivisionService,
    DepartmentService,
  ],
})
export class MasterModule {}
