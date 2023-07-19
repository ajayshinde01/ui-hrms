import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatatableComponent } from './components/datatable/datatable.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    DatatableComponent
  ],
  imports: [
    CommonModule,
    RouterModule
 
  ],
  exports:[DatatableComponent]
})
export class SharedModule { }
