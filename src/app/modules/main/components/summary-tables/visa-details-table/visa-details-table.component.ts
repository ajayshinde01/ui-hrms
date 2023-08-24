import { HttpParams } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Data, Router } from '@angular/router';
import { Visa } from 'src/app/modules/main/models/visa.model';
import { EmployeeService } from 'src/app/modules/main/services/employee.service';
import { ColumnsMetadata } from 'src/app/modules/master/models/columnMetaData';
import { EmployeeVisaDetailsFormComponent } from '../../forms/employee/employee-visa-details-form/employee-visa-details-form.component';
@Component({
  selector: 'app-visa-details-table',
  templateUrl: './visa-details-table.component.html',
  styleUrls: ['./visa-details-table.component.scss']
})
export class VisaDetailsTableComponent {
  [x: string]: any;
  employeeVisaHeaders: { columnsMetadata: Array<ColumnsMetadata>; };
  // employeeHeaders: { columnsMetadata: Array<ColumnsMetadata> } = {
   //  columnsMetadata: [],
   //};
   employeeMetaData: { content: Array<Visa>; totalElements: number } = {
     content: [],
     totalElements: 0,
   };
   matDialogRef: MatDialogRef<EmployeeVisaDetailsFormComponent>;

   params: HttpParams = new HttpParams();

   constructor(
     private employeeService: EmployeeService,
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
     this.employeeService.getEmployeeVisaHeaders().subscribe(
       (response: { columnsMetadata: Array<ColumnsMetadata> }) => {
         this.employeeVisaHeaders = response;
         console.log(this.employeeVisaHeaders);
       },
       (error: any) => {
         console.error('GET Request failed', error);
       }
     );
   }
 
   action(event: Data) {
     let type: string = event['event'];
     let id: string = event['data'].id;
     const queryParam = { id: id };
     switch (type) {
       case 'delete':
       /*  this.employeeService.deleteEmployee(id).subscribe(
           (response: ApiResponse) => {
             this.employeeService.notify('Employee Deleted successfully..!');
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
         );*/
         break;
       case 'add':
        this.OpenModal();
         this.router.navigate(['/main/employee-table']);
         break;
       case 'edit':
         this.router.navigate(['/main/employee-table'], {
           queryParams: queryParam,
         });
         break;
     }
   }
 
   searchFunction(params: HttpParams) {
     this.params = params;
     this.employeeService
       .searchVisa(params)
       .subscribe(
         (data: { content: Array<Visa>; totalElements: number }) => {
           console.log(data.content);
           console.log(data.totalElements);
           this.employeeMetaData = data;
         }
       );
   }

   OpenModal() {
    this.matDialogRef = this.matDialog.open(EmployeeVisaDetailsFormComponent, {
      disableClose: true,
    });

    this.matDialogRef.afterClosed().subscribe((res: any) => {
      this.searchFunction(this.params);

      if (res == true) {
      }
    });
  }
}
