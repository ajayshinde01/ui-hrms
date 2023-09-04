import { Component, EventEmitter, Output } from '@angular/core';
import { ColumnsMetadata } from '../../../models/columns-metadata';
import { HttpParams } from '@angular/common/http';
import { Employees } from '../../../models/employee.model';
import { Data, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeService } from '../../../services/employee.service';
import { ApiResponse } from '../../../models/response';

@Component({
  selector: 'app-employee-table',
  templateUrl: './employee-table.component.html',
  styleUrls: ['./employee-table.component.scss'],
})
export class EmployeeTableComponent {
  @Output() sendDataEvnt = new EventEmitter<number>();
  employeeHeaders: { columnsMetadata: Array<ColumnsMetadata> } = {
    columnsMetadata: [],
  };
  employeeMetaData: { content: Array<Employees>; totalElements: number } = {
    content: [],
    totalElements: 0,
  };

  masterName: string = 'Employee';
  buttonVisible: Array<boolean> = [true, true, true];
  params: HttpParams = new HttpParams();
  constructor(
    private employeeService: EmployeeService,
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
    this.employeeService.getEmployeeHeaders().subscribe(
      (response: { columnsMetadata: Array<ColumnsMetadata> }) => {
        this.employeeHeaders = response;
        //console.log(this.employeeHeaders);
      },
      (error: any) => {
        console.error('GET Request failed', error);
      }
    );
  }

  action(event: Data) {
    let type: string = event['event'];
    let id: string = event['data'].id;
    let queryParam = { id: id, actionLabel: 'Save' };
    switch (type) {
      case 'delete':
        this.employeeService.deleteEmployee(id).subscribe(
          (response: ApiResponse) => {
            this.employeeService.notify('Employee deleted successfully');
            const currentPage = Number(this.params.get('page'));
            if (this.employeeMetaData.content.length === 1 && currentPage > 0) {
              const newPage = currentPage - 1;
              this.params = this.params.set('page', newPage.toString());
              this.searchFunction(this.params);
            }
            this.searchFunction(this.params);
          },
          (error: any) => {
            console.error('DELETE-Employee Request failed', error);
          }
        );
        break;
      case 'add':
        this.router.navigate(['/main/employee-info']);
        break;
      case 'edit':
        queryParam.actionLabel = 'Update';
        this.router.navigate(['/main/employee-info'], {
          queryParams: queryParam,
        });
        break;
    }
  }

  searchFunction(params: HttpParams) {
    this.params = params;
    this.employeeService
      .search(params)
      .subscribe(
        (data: { content: Array<Employees>; totalElements: number }) => {
          // console.log(data.content);
          //  console.log(data.totalElements);
          this.employeeMetaData = data;
        }
      );
  }
}
