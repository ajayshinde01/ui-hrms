import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../core/components/layout/layout.component';
import { RoleComponent } from './components/summary-tables/role/role.table.component';
import { DesignationComponent } from './components/summary-tables/designation/designation.component';
import { RoleFormComponent } from './components/forms/role-form/role.form.component';
import { GradeComponent } from './components/summary-tables/grade/grade.component';
import { DesignationFormComponent } from './components/forms/designation-form/designation.form.component';
import { GradeFormComponent } from './components/forms/grade-form/grade.form.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'master',
    pathMatch: 'full',
  },
  {
    path: '',
    component: LayoutComponent,
    children: [{ path: 'role', component: RoleComponent }],
  },
  {
    path: '',
    component: LayoutComponent,
    children: [{ path: 'designation', component: DesignationComponent }],
  },
  {
    path: '',
    component: LayoutComponent,
    children: [{ path: 'roleForm', component: RoleFormComponent }],
  },
  {
    path: '',
    component: LayoutComponent,
    children: [{ path: 'grade', component: GradeComponent }],
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
    children: [{ path: 'gradeForm', component: GradeFormComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterRoutingModule {}
