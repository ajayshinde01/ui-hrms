import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { UserFormComponent } from './components/forms/user-form/user-form.component';
import { UserTableComponent } from './components/summary-tables/user-table/user-table.component';
import { UserRoutingModule } from './user-routing.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { UserRoleTableComponent } from './components/summary-tables/user-role-table/user-role-table.component';
import { UserRoleFormComponent } from './components/forms/user-role-form/user-role-form.component';
import { ScopeTableComponent } from './components/summary-tables/scope-table/scope-table.component';
import { ScopeFormComponent } from './components/forms/scope-form/scope-form.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  declarations: [
    UserFormComponent,
    UserTableComponent,
    UserRoleTableComponent,
    UserRoleFormComponent,
    ScopeTableComponent,
    ScopeFormComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTabsModule,
    MatIconModule,
    MatDividerModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatSlideToggleModule,
  ],
})
export class UserModule {}
