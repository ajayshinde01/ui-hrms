import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from './core/core.module';

const routes: Routes = [
  {path:"",redirectTo:"main",pathMatch:"full"},
  {
    path: "main", loadChildren: () => import('./main/main.module').then(m => m.MainModule)
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule,CoreModule]
})
export class AppRoutingModule { }
