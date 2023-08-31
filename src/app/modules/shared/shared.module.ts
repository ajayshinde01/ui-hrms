import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatatableComponent } from './components/datatable/datatable.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataTableService } from './components/datatable/dataTable.service';
import { DeletePopupComponent } from './delete-popup/delete-popup.component';

@NgModule({
  declarations: [DatatableComponent, DeletePopupComponent],
  imports: [CommonModule, RouterModule, FormsModule],
  exports: [DatatableComponent],
  providers: [DataTableService],
})
export class SharedModule {}
