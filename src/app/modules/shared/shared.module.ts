import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatatableComponent } from './components/datatable/datatable.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [DatatableComponent],
  imports: [CommonModule, RouterModule, FormsModule],
  exports: [DatatableComponent],
})
export class SharedModule {}
