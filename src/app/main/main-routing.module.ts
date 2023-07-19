import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestComponent } from './components/test/test.component';
import { DemoComponent } from './components/demo/demo.component';
import { LayoutComponent } from '../core/components/layout/layout.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: "test",
    pathMatch: "full"
  },
  {path: "",component: LayoutComponent,
  children: [
  {path:"test",component:TestComponent},
  {path:"demo",component:DemoComponent}
]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
