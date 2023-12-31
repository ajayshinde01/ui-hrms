import { Component, EventEmitter, Output } from '@angular/core';
import { Employee } from '../../../models/employee.model';
import { ColumnsMetadata } from '../../../models/columnMetaData';
import { EmployeeTypeService } from '../../../services/employee-type.service';
import { Data, Router } from '@angular/router';
import { ApiResponse } from '../../../models/response';
import { PopupComponent } from '../../helper/popup/popup.component';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { HttpParams } from '@angular/common/http';
import { EmployeeTypeComponent } from '../../forms/employee-type-form/employee-type.component';

@Component({
  selector: 'app-employee-type-table',
  templateUrl: './employee-type-table.component.html',
  styleUrls: ['./employee-type-table.component.scss'],
})
export class EmployeeTypeTableComponent {
  @Output() sendDataEvnt = new EventEmitter<number>();
  employeeTypeMetaData: { content: Array<Employee>; totalElements: number } = {
    content: [],
    totalElements: 0,
  };
  // employeeTypeHeaders: { columnsMetadata: Array<ColumnsMetadata> } = {
  //   columnsMetadata: [],
  // };
  buttonVisible:Array<boolean> =[true ,true, true]
  employeeTypeHeaders: any;
  params: HttpParams = new HttpParams();

  masterName: string = 'Employee Type';

  matDialogRef: MatDialogRef<EmployeeTypeComponent>;

  constructor(
    private employeeTypeService: EmployeeTypeService,
    private router: Router,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getHeaders();
    let params = new HttpParams();
    params = params.set('page', 0);
    params = params.set('size', 10);
    this.searchFunction(params);
  }

  getHeaders() {
    this.employeeTypeService.getEmployeeTypeHeaders().subscribe(
      (response: { columnsMetadata: Array<ColumnsMetadata> }) => {
        this.employeeTypeHeaders = response.columnsMetadata;
        console.log(this.employeeTypeHeaders);
      },
      (error: any) => {
        console.error('GET Request failed', error);
      }
    );
  }

  action(event: Data) {
    let type: string = event['event'];
    let id: string = event['data'].employeeTypeId;
    const queryParam = { id: id };
    switch (type) {
      case 'delete':
        this.employeeTypeService
          .deleteEmployee(event['data'].employeeTypeId)
          .subscribe(
            (response: ApiResponse) => {
              this.employeeTypeService.notify(
                'Employee Type deleted Successfully'
              );
              this.searchFunction(this.params);

              const currentPage = Number(this.params.get('page'));

              if (
                this.employeeTypeMetaData.content.length === 1 &&
                currentPage > 0
              ) {
                const newPage = currentPage - 1;

                this.params = this.params.set('page', newPage.toString());

                this.searchFunction(this.params);
              }
            },
            (error: any) => {
              console.error('DELETE-Employee Type Request failed', error);
            }
          );
        break;
      case 'add':
        this.OpenModal();
        this.router.navigate(['/master/employee-table']);
        break;

      case 'edit':
        this.OpenModalForEdit(id);
        this.router.navigate(['/master/employee-table'], {
          queryParams: queryParam,
        });
        break;
    }
  }

  searchFunction(params: HttpParams) {
    this.params = params;
    this.employeeTypeService
      .search(params)
      .subscribe(
        (data: { content: Array<Employee>; totalElements: number }) => {
          console.log(data.content);
          console.log(data.totalElements);

          this.employeeTypeMetaData = data;
        }
      );
  }

  OpenModal() {
    this.matDialogRef = this.matDialog.open(EmployeeTypeComponent, {
      disableClose: true,
    });

    this.matDialogRef.afterClosed().subscribe((res: any) => {
      this.searchFunction(this.params);

      if (res == true) {
      }
    });
  }

  OpenModalForEdit(data: string) {
    this.matDialogRef = this.matDialog.open(EmployeeTypeComponent, {
      data: { id: data },
      disableClose: true,
    });

    this.matDialogRef.afterClosed().subscribe((res: any) => {
      this.searchFunction(this.params);

      if (res == true) {
      }
    });
  }
}
