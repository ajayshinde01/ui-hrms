import { Component, EventEmitter, Output } from '@angular/core';
import { Department } from '../../../models/department.model';
import { ColumnsMetadata } from '../../../models/columnMetaData';
import { DepartmentService } from '../../../services/department.service';
import { MatDialog } from '@angular/material/dialog';
import { Data, Router } from '@angular/router';
import { ApiResponse } from '../../../models/response';
import { PopupComponent } from '../../helper/popup/popup.component';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-department-table',
  templateUrl: './department-table.component.html',
  styleUrls: ['./department-table.component.scss'],
})
export class DepartmentTableComponent {
  @Output() sendDataEvnt = new EventEmitter<number>();
  departmentHeaders: { columnsMetadata: Array<ColumnsMetadata> } = {
    columnsMetadata: [],
  };
  departmentMetaData: { content: Array<Department>; totalElements: number } = {
    content: [],
    totalElements: 0,
  };

  params: HttpParams = new HttpParams();
  constructor(
    private departmentService: DepartmentService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getHeaders();

    this.params = this.params.set('page', 0);
    this.params = this.params.set('size', 10);
    this.searchFunction(this.params);
  }

  getHeaders() {
    this.departmentService.getDepartmentHeaders().subscribe(
      (response: { columnsMetadata: Array<ColumnsMetadata> }) => {
        this.departmentHeaders = response;
        console.log(this.departmentHeaders);
      },
      (error: any) => {
        console.error('GET Request failed', error);
      }
    );
  }

  action(event: Data) {
    let type: string = event['event'];
    let id: string = event['data'].departmentId;
    const queryParam = { id: id };
    switch (type) {
      case 'delete':
        this.departmentService
          .deleteDepartment(event['data'].departmentId)
          .subscribe(
            (response: ApiResponse) => {
              this.departmentService.notify(
                'Department Deleted successfully..!'
              );

              this.searchFunction(this.params);
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
        this.router.navigate(['/master/department'], {
          queryParams: queryParam,
        });
        break;
    }
  }

  searchFunction(params: HttpParams) {
    this.params = params;
    this.departmentService
      .search(params)
      .subscribe(
        (data: { content: Array<Department>; totalElements: number }) => {
          console.log(data.content);
          console.log(data.totalElements);
          this.departmentMetaData = data;
        }
      );
  }
}
