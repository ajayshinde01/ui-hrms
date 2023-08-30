import { Component, EventEmitter, Output } from '@angular/core';

import { Department } from '../../../models/department.model';

import { ColumnsMetadata } from '../../../models/columnMetaData';

import { DepartmentService } from '../../../services/department.service';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { Data, Router } from '@angular/router';

import { ApiResponse } from '../../../models/response';

import { PopupComponent } from '../../helper/popup/popup.component';

import { HttpParams } from '@angular/common/http';

import { DepartmentComponent } from '../../forms/department-form/department.component';

@Component({
  selector: 'app-department-table',

  templateUrl: './department-table.component.html',

  styleUrls: ['./department-table.component.scss'],
})
export class DepartmentTableComponent {
  @Output() sendDataEvnt = new EventEmitter<number>();

  matDialogRef: MatDialogRef<DepartmentComponent>;

  departmentHeaders: { columnsMetadata: Array<ColumnsMetadata> } = {
    columnsMetadata: [],
  };

  departmentMetaData: { content: Array<Department>; totalElements: number } = {
    content: [],

    totalElements: 0,
  };

  params: HttpParams = new HttpParams();

  masterName: string = 'Department';

  constructor(
    private departmentService: DepartmentService,

    private router: Router,

    private matDialog: MatDialog
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
              this.departmentService.notify('Department deleted successfully');

              this.searchFunction(this.params);

              const currentPage = Number(this.params.get('page'));

              if (
                this.departmentMetaData.content.length === 1 &&
                currentPage > 0
              ) {
                const newPage = currentPage - 1;

                this.params = this.params.set('page', newPage.toString());

                this.searchFunction(this.params);
              }
            },

            (error: any) => {
              console.error('DELETE-Department Request failed', error);
            }
          );

        break;

      case 'add':
        this.OpenModal();

        this.router.navigate(['/master/department-table']);

        break;

      case 'edit':
        this.OpenModalForEdit(id);

        this.router.navigate(['/master/department-table'], {
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

  OpenModal() {
    this.matDialogRef = this.matDialog.open(DepartmentComponent, {
      disableClose: true,
    });

    this.matDialogRef.afterClosed().subscribe((res: any) => {
      this.searchFunction(this.params);

      if (res == true) {
      }
    });
  }

  OpenModalForEdit(data: string) {
    this.matDialogRef = this.matDialog.open(DepartmentComponent, {
      data: { id: data },

      disableClose: true,
    });
console.log("params",this.params);
    this.matDialogRef.afterClosed().subscribe((res: any) => {
      this.searchFunction(this.params);

      if (res == true) {
      }
    });
  }
}
