import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class DataTableService {
  constructor(private toastrService: ToastrService) {}
  notify(message: string) {
    this.toastrService.warning(message);
  }
}
