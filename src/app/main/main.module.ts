import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';

import { DemoComponent } from './components/demo/demo.component';
import { CoreModule } from '../core/core.module';
import { DatatableComponent } from '../shared/components/datatable/datatable.component';
import { TestComponent } from './components/test/test.component';



@NgModule({
  declarations: [
    // DemoComponent,
    TestComponent
    


    
  ],
  imports: [
    CommonModule,
    CoreModule,
    MainRoutingModule,
    SharedModule
  ]
})
export class MainModule { }
