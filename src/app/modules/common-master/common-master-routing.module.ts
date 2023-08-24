import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../core/components/layout/layout.component';
import { ParentComponent } from './components/summary-tables/parent/parent.component';

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommonMasterRoutingModule {}
