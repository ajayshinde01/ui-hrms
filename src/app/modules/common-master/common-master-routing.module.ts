import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../core/components/layout/layout.component';
import { ParentComponent } from './components/summary-tables/parent/parent.component';
import { ParentFormComponent } from './components/forms/parent-form/parent-form.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'common-master',
    pathMatch: 'full',
  },
  {
    path: '',
    component: LayoutComponent,
    children: [{ path: 'parent', component: ParentComponent }],
  },
  {
    path: '',
    component: LayoutComponent,
    children: [{ path: 'parentForm', component: ParentFormComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommonMasterRoutingModule {}
