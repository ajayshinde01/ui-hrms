import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatatableComponent } from './components/datatable/datatable.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RoleComponent } from '../master/components/summary-tables/role/role.table.component';

@NgModule({
  declarations: [DatatableComponent],
  imports: [CommonModule, RouterModule, FormsModule],
  exports: [DatatableComponent],
})
export class SharedModule {}
