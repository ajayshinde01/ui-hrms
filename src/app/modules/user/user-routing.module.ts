import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserFormComponent } from './components/forms/user-form/user-form.component';
import { LayoutComponent } from '../core/components/layout/layout.component';
import { UserTableComponent } from './components/summary-tables/user-table/user-table.component';
import { UserRoleTableComponent } from './components/summary-tables/user-role-table/user-role-table.component';
import { UserRoleFormComponent } from './components/forms/user-role-form/user-role-form.component';
import { ScopeFormComponent } from './components/forms/scope-form/scope-form.component';
import { ScopeTableComponent } from './components/summary-tables/scope-table/scope-table.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'user',
    pathMatch: 'full',
  },
  {
    path: '',
    component: LayoutComponent,
    children: [{ path: 'user-table', component: UserTableComponent }],
  },
  {
    path: '',
    component: LayoutComponent,
    children: [{ path: 'user-form', component: UserFormComponent }],
  },
  {
    path: '',
    component: LayoutComponent,
    children: [{ path: 'user-role-table', component: UserRoleTableComponent }],
  },
  {
    path: '',
    component: LayoutComponent,
    children: [{ path: 'user-role-form', component: UserRoleFormComponent }],
  },
  {
    path: '',
    component: LayoutComponent,
    children: [{ path: 'scope-form', component: ScopeFormComponent }],
  },
  {
    path: '',
    component: LayoutComponent,
    children: [{ path: 'scope-table', component: ScopeTableComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
