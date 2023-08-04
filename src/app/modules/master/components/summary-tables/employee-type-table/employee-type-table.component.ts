import { Component,EventEmitter, Output } from '@angular/core';
import { Employee } from '../../../models/employee.model';
import { ColumnsMetadata } from '../../../models/columnMetaData';
import { EmployeeTypeService } from '../../../services/employee-type.service';
import { Data, Router } from '@angular/router';
import { ApiResponse } from '../../../models/response';
import { PopupContentComponent } from '../../helper/popup/popup.component';
import { MatDialog,MatDialogConfig } from '@angular/material/dialog';
import { HttpParams } from '@angular/common/http';


@Component({
  selector: 'app-employee-type-table',
  templateUrl: './employee-type-table.component.html',
  styleUrls: ['./employee-type-table.component.scss']
})
export class EmployeeTypeTableComponent {
 @Output() sendDataEvnt = new EventEmitter<number>();
  employeeTypeMetaData: { content: Array<Employee>; totalElements: number } = {	
    content: [],	
    totalElements: 0,	
  };
  employeeTypeHeaders: { columnsMetadata: Array<ColumnsMetadata> } = {
    columnsMetadata: [],
  };
 
  constructor(private employeeTypeService: EmployeeTypeService,    private router: Router,
    private dialog: MatDialog) {}

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
      this.employeeTypeHeaders = response;
      console.log(this.employeeTypeHeaders);
    },
    (error: any) => {
      console.error('GET Request failed', error);
    });
  }

  action(event: Data) {
    let type: string = event['event'];
    let id: string = event['data'].employeeTypeId;
    const queryParam = { id: id };
    switch (type) {
      case 'delete':
        this.employeeTypeService.deleteEmployee(event['data'].employeeTypeId).subscribe(
          (response: ApiResponse) => {
            this.employeeTypeService.notify("Record Delete Successfully...");
            let params = new HttpParams();

            params = params.set('page', 0);

            params = params.set('size', 10);
            this.searchFunction(params);
           
          },
          (error: any) => {
            console.error('DELETE-Employee Type Request failed', error);
          }
        );
        break;
      case 'add':
        this.router.navigate(['/master/employee-type']);
        break;

      case 'edit':
        if (event['data'].employeeTypeId == undefined)
          this.employeeTypeService.warn('Please select Id for the operation');
        this.router.navigate(['/master/employee-type'], { queryParams: queryParam });
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
    this.employeeTypeService
      .search(event)
      .subscribe((data: { content: Array<Employee>; totalElements: number }) => {
        console.log(data.content);
        console.log(data.totalElements);
        
        this.employeeTypeMetaData = data;
        
      });
  }
  
}
