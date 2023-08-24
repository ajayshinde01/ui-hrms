import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from './modules/core/core.module';
import { LoginComponent } from './modules/core/components/login/login.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'main',
    loadChildren: () =>
      import('./modules/main/main.module').then((m) => m.MainModule),
  },
  {
    path: 'master',
    loadChildren: () =>
      import('./modules/master/master.module').then((m) => m.MasterModule),
  },
  { path: 'login', component: LoginComponent },
  { path: 'admin-login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule, CoreModule],
})
export class AppRoutingModule {}
