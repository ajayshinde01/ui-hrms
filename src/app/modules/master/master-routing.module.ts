import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../core/components/layout/layout.component';
import { RoleComponent } from './components/summary-tables/role/role.table.component';
import { DesignationComponent } from './components/summary-tables/designation/designation.component';
import { RoleFormComponent } from './components/forms/role-form/role.form.component';
import { GradeComponent } from './components/summary-tables/grade/grade.component';
import { DesignationFormComponent } from './components/forms/designation-form/designation.form.component';
import { GradeFormComponent } from './components/forms/grade-form/grade.form.component';
import { EmployeeTypeComponent } from './components/forms/employee-type-form/employee-type.component';
import { EmployeeTypeTableComponent } from './components/summary-tables/employee-type-table/employee-type-table.component';
import { DivisionComponent } from './components/forms/division-form/division.component';
import { DivisionTableComponent } from './components/summary-tables/division-table/division-table.component';
import { DepartmentComponent } from './components/forms/department-form/department.component';
import { DepartmentTableComponent } from './components/summary-tables/department-table/department-table.component';
import { DashboardComponent } from './components/summary-tables/dashboard/dashboard.component';
import { OrganizationComponent } from './components/summary-tables/organization/organization.component';
import { EmailTemplateFormComponent } from './components/forms/email-template-form/email-template-form.component';
import { EmailTemplateTableComponent } from './components/summary-tables/email-template-table/email-template-table.component';
import { EmailFormComponent } from './components/forms/email-form/email-form.component';
import { EmailTableComponent } from './components/summary-tables/email-table/email-table.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'master',
    pathMatch: 'full',
  },
  {
    path: '',
    component: LayoutComponent,
    children: [{ path: 'dashboard', component: DashboardComponent }],
  },
  {
    path: '',
    component: LayoutComponent,
    children: [{ path: 'role', component: RoleComponent }],
  },
  {
    path: '',
    component: LayoutComponent,
    children: [{ path: 'employee-type', component: EmployeeTypeComponent }],
  },
  {
    path: '',
    component: LayoutComponent,
    children: [{ path: 'designation', component: DesignationComponent }],
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'employee-table', component: EmployeeTypeTableComponent },
    ],
  },
  {
    path: '',
    component: LayoutComponent,
    children: [{ path: 'roleForm', component: RoleFormComponent }],
  },
  {
    path: '',
    component: LayoutComponent,
    children: [{ path: 'division', component: DivisionComponent }],
  },
  {
    path: '',
    component: LayoutComponent,
    children: [{ path: 'grade', component: GradeComponent }],
  },
  {
    path: '',
    component: LayoutComponent,
    children: [{ path: 'division-table', component: DivisionTableComponent }],
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'designationForm', component: DesignationFormComponent },
    ],
  },
  {
    path: '',
    component: LayoutComponent,

    children: [{ path: 'department', component: DepartmentComponent }],
  },
  {
    path: '',
    component: LayoutComponent,

    children: [{ path: 'gradeForm', component: GradeFormComponent }],
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'department-table', component: DepartmentTableComponent },
    ],
  },
  {
    path: '',
    component: LayoutComponent,
    children: [{ path: 'organization', component: OrganizationComponent }],
  },
{
    path: '',
    component: LayoutComponent,
    children: [{ path: 'emailtemplate', component: EmailTemplateFormComponent }],
  },
  {
    path: '',
    component: LayoutComponent,
    children: [{ path: 'emailtemplatetable', component: EmailTemplateTableComponent }],
  },
  {
    path: '',
    component: LayoutComponent,
    children: [{ path: 'emailform', component: EmailFormComponent }],
  },
  {
    path: '',
    component: LayoutComponent,
    children: [{ path: 'emailtable', component: EmailTableComponent }],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterRoutingModule {}
