import { Component,EventEmitter, Output } from '@angular/core';
import { Department } from '../../../models/department.model';
import { ColumnsMetadata } from '../../../models/columnMetaData';
import { DepartmentService } from '../../../services/department.service';
import { MatDialog } from '@angular/material/dialog';
import { Data, Router } from '@angular/router';
import { ApiResponse } from '../../../models/response';
import { PopupContentComponent } from '../../helper/popup/popup.component';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-department-table',
  templateUrl: './department-table.component.html',
  styleUrls: ['./department-table.component.scss']
})
export class DepartmentTableComponent   {

@Output() sendDataEvnt = new EventEmitter<number>();
  departmentHeaders: { columnsMetadata: Array<ColumnsMetadata> } = {
    columnsMetadata: [],
  };
  departmentMetaData: { content: Array<Department>; totalElements: number } = {
    content: [],
    totalElements: 0,
  };
  
  constructor(private departmentService: DepartmentService,  private router: Router,
    private dialog: MatDialog) {}

  ngOnInit(): void {

  this.getHeaders();
   let params = new HttpParams();
    params = params.set('page', 0);
    params = params.set('size', 10);
    this.searchFunction(params);
  }

  getHeaders() {
    this.departmentService.getDepartmentHeaders().subscribe(  
      (response: { columnsMetadata: Array<ColumnsMetadata> }) => {
      this.departmentHeaders = response;
      console.log(this.departmentHeaders);
    },
    (error: any) => {
      console.error('GET Request failed', error);
    });
  }

  action(event: Data) {
    let type: string = event['event'];
        let id: string = event['data'].departmentId;
    const queryParam = { id: id };
    switch (type) {
      case 'delete':
        this.departmentService.deleteDepartment(event['data'].departmentId).subscribe(
          (response: ApiResponse) => {
            this.departmentService.notify('Department Deleted successfully..!');
            let params = new HttpParams();
            params = params.set('page', 0);
            params = params.set('size', 10);
            this.searchFunction(params);
          },
          (error: any) => {
            console.error('DELETE-Department Request failed', error);
          }
        );
        break;
      case 'add':
        this.router.navigate(['/master/department']);
        break;
        
      case 'edit':
        if (event['data'].roleId == undefined)
          this.departmentService.warn('Please select Id for the operation');
        this.router.navigate(['/master/department'], { queryParams: queryParam });
        break;
    }
  }

  openPopup(message: string) {
    this.dialog.open(PopupContentComponent, {
      width: '600px',
      height: '200px',
      data: { message: message },
    });
  }
    searchFunction(event: HttpParams) {
    this.departmentService
      .search(event)
      .subscribe((data: { content: Array<Department>; totalElements: number }) => {
        console.log(data.content);
        console.log(data.totalElements);
        this.departmentMetaData = data;
      });
}
}

