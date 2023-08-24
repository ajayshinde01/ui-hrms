import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonMasterRoutingModule } from './common-master-routing.module';
import { ChildComponent } from './components/summary-tables/child/child.component';
import { ParentComponent } from './components/summary-tables/parent/parent.component';
import { ParentService } from './services/parent.service';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ParentFormComponent } from './components/forms/parent-form/parent-form.component';
import { ChildFormComponent } from './components/forms/child-form/child-form.component';

@NgModule({
  declarations: [ParentComponent, ChildComponent, ParentFormComponent, ChildFormComponent],
  imports: [
    CommonModule,
    CommonMasterRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: [ParentService],
})
export class CommonMasterModule {}
