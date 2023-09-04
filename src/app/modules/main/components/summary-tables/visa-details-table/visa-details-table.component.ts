import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Visa } from 'src/app/modules/main/models/visa.model';
import { EmployeeService } from 'src/app/modules/main/services/employee.service';
import { ColumnsMetadata } from 'src/app/modules/master/models/columnMetaData';
import { ApiResponse } from '../../../models/response';
import { EmployeeVisaDetailsFormComponent } from '../../forms/employee-visa-details-form/employee-visa-details-form.component';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-visa-details-table',
  templateUrl: './visa-details-table.component.html',
  styleUrls: ['./visa-details-table.component.scss'],
})
export class VisaDetailsTableComponent implements OnInit {
  @Output() sendDataEvnt = new EventEmitter<number>();
  buttonVisible: Array<boolean> = [true, true, true];
  matDialogRef: MatDialogRef<EmployeeVisaDetailsFormComponent>;
  emp_id: any;
  masterName: string = 'Visa Details';
  visa_id: any;
  visaDetailsHeaders: any = '';
  visaDetailsMetaData: {
    content: Array<Visa>;
    totalElements: number;
  } = {
      content: [],
      totalElements: 0,
    };
  params: HttpParams = new HttpParams();

  constructor(
    private employeeService: EmployeeService,

    private matDialog: MatDialog,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getHeaders();
    console.log('Visa table');
    this.params = this.params.set('page', '0');
    this.params = this.params.set('size', '10');
    this.emp_id = this.route.snapshot.queryParamMap.get('id');
    this.searchFunction(this.params);
  }

  getHeaders() {
    this.employeeService.getEmployeeVisaHeaders().subscribe(
      (response: { columnsMetadata: Array<ColumnsMetadata> }) => {
        this.visaDetailsHeaders = response;
      },
      (error: any) => {
        console.error('GET Request failed', error);
      }
    );
  }

  action(event: any) {
    let type: string = event['event'];
    let id: any = event['data'].id;
    console.log('dataid', id);
    const queryParam = { id: id };
    switch (type) {
      case 'delete':
        this.employeeService.deleteEmployeeVisa(id, this.emp_id).subscribe(
          (response: ApiResponse) => {
            this.employeeService.notify(
              'Employee visa details Deleted successfully..!'
            );
            const currentPage = Number(this.params.get('page'));
            if (
              this.visaDetailsMetaData.content.length === 1 &&
              currentPage > 0
            ) {
              const newPage = currentPage - 1;
              this.params = this.params.set('page', newPage.toString());
            }
            this.searchFunction(this.params);
          },
          (error: any) => {
            console.error('DELETE-Employee Request failed', error);
          }
        );
        break;
      case 'add':
        this.openModal();
        break;
      case 'edit':
        this.visa_id = id;
        this.openModalForEdit(id);
        break;
    }
  }

  searchFunction(params: HttpParams) {
    this.params = params;
    this.employeeService
      .searchVisa(params, this.emp_id)
      .subscribe((data: { content: Array<Visa>; totalElements: number }) => {
        this.visaDetailsMetaData = data;
      });
  }

  openModal() {
    this.matDialogRef = this.matDialog.open(EmployeeVisaDetailsFormComponent, {
      width: '530px',
      panelClass: 'my-dialog',
      disableClose: true,
    });
    this.matDialogRef.afterClosed().subscribe((res: any) => {
      this.searchFunction(this.params);
      if (res == true) {
        // Do something if necessary
      }
    });
  }

  openModalForEdit(id: string) {
    this.matDialogRef = this.matDialog.open(EmployeeVisaDetailsFormComponent, {
      data: { id: id, actionLabel: 'Save' },
      width: '530px',
      panelClass: 'my-dialog',
      disableClose: true,
    });
    this.matDialogRef.afterClosed().subscribe((res: any) => {
      this.searchFunction(this.params);
      if (res == true) {
        // Do something if necessary
      }
    });
  }
}
