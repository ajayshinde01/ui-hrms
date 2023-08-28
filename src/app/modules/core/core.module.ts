import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LayoutComponent } from './components/layout/layout.component';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    LayoutComponent,
    FooterComponent,
    LoginComponent,
  ],
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  exports: [LayoutComponent, HeaderComponent, SidebarComponent],
})
export class CoreModule {}
