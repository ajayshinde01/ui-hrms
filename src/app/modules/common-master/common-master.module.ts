import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonMasterRoutingModule } from './common-master-routing.module';
import { ChildComponent } from './components/summary-tables/child/child.component';
import { ParentComponent } from './components/summary-tables/parent/parent.component';
import { ParentService } from './services/parent.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ParentFormComponent } from './components/forms/parent-form/parent-form.component';
import { ChildFormComponent } from './components/forms/child-form/child-form.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { ChildService } from './services/child.service';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    ParentComponent,
    ChildComponent,
    ParentFormComponent,
    ChildFormComponent,
  ],
  imports: [
    CommonModule,
    CommonMasterRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    SharedModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatTabsModule,
    MatIconModule,
    MatDividerModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
  ],
  providers: [ParentService, ChildService],
})
export class CommonMasterModule {}
