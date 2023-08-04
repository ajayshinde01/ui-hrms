import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MasterRoutingModule } from './master-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoleService } from './services/role.service';
import { PopupContentComponent } from './components/helper/popup/popup.component';
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



@NgModule({
  declarations: [
  
    DepartmentComponent,
    DepartmentTableComponent,
    EmployeeTypeComponent,
    EmployeeTypeTableComponent,
    DivisionComponent,
    DivisionTableComponent,
    PopupContentComponent,
  ],
  entryComponents: [PopupContentComponent],
  imports: [
    CommonModule,
    MasterRoutingModule,
    SharedModule,
    MatFormFieldModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    ToastrModule
    
  ],
  providers: [RoleService,EmployeeTypeService,DivisionService,DepartmentService],
})
export class MasterModule {}
