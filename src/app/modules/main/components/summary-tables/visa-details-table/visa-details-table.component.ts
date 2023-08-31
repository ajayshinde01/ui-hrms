import { HttpParams } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { Visa } from 'src/app/modules/main/models/visa.model';
import { EmployeeService } from 'src/app/modules/main/services/employee.service';
import { ColumnsMetadata } from 'src/app/modules/master/models/columnMetaData';
import { EmployeeVisaDetailsFormComponent } from '../../forms/employee-visa-details-form/employee-visa-details-form.component';
import { ApiResponse } from '../../../models/response';

@Component({
  selector: 'app-visa-details-table',
  templateUrl: './visa-details-table.component.html',
  styleUrls: ['./visa-details-table.component.scss'],
})
export class VisaDetailsTableComponent {
  [x: string]: any;
  emp_id:any;
  visa_id:any;
  employeeVisaHeaders: { columnsMetadata: Array<ColumnsMetadata> };
  buttonVisible:Array<boolean> =[true ,true, true];

 // employeeVisaHeaders={columnsMetadata: Array<ColumnsMetadata>};
 /* employeeVisaHeaders = { columnsMetadata:
  [
    {
        name: "",
        mappedBy: "id",
        sortBy: "id",
        type: "radio",
        width: 8
    },
    {
        name: "Visa Number",
        mappedBy: "visaNumber",
        sortBy: "visaNumber",
        type: "text",
        width: 30
    },
    {
        name: "Country Code",
        mappedBy: "countryCode",
        sortBy: "countryCode",
        type: "text",
        width: 30
    },
    {
        name: "Valid Date",
        mappedBy: "validDate",
        sortBy: "validDate",
        type: "text",
        width: 30
    }
]};*/

  // employeeHeaders: { columnsMetadata: Array<ColumnsMetadata> } = {
   //  columnsMetadata: [],
   //};
   employeeVisaMetaData: { content: Array<Visa>; totalElements: number } = {
    content: [],
     totalElements: 0,
   };
//   (data: { content: Array<Visa>; totalElements: number })
 /*  employeeVisaMetaData={
    content:[
      {
          id: "1",
          visaNumber: "345",
          countryCode: "india",
          validDate: "09/09/2023",
      },
      {
        id: "2",
        visaNumber: "345",
        countryCode: "india",
        validDate: "09/09/2023",
    }
    ],
    totalElements:0
};*/
   matDialogRef: MatDialogRef<EmployeeVisaDetailsFormComponent>;

   params: HttpParams = new HttpParams();

   constructor(
     private employeeService: EmployeeService,
     private router: Router,
     private matDialog: MatDialog,
     private route: ActivatedRoute,

   ) {}
 
   ngOnInit(): void {
    
     this.getHeaders();
     console.log("Visa table");
     this.params = this.params.set('page', 0);
     this.params = this.params.set('size', 10);
     this.emp_id = this.route.snapshot.queryParamMap.get("id");
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

     console.log("dataid",id);
     const queryParam = { id: id };
     switch (type) {
       case 'delete':
         this.employeeService.deleteEmployeeVisa(id).subscribe(
           (response: ApiResponse) => {
             this.employeeService.notify('Employee visa details Deleted successfully..!');
             const currentPage = Number(this.params.get('page'));
             if (this.employeeVisaMetaData.content.length === 1 && currentPage > 0) {
               const newPage = currentPage - 1;
               this.params = this.params.set('page', newPage.toString());
             //  this.searchFunction(this.params);
             }
             this.searchFunction(this.params);
           },
           (error: any) => {
             console.error('DELETE-Employee Request failed', error);
           }
         );
         break;
       case 'add':
        this.OpenModal();
       //  this.router.navigate(['/main/visa-table']);
         break;
       case 'edit':
        this.visa_id=id;
        this.OpenModalForEdit(id);
       //  this.router.navigate(['/main/visa-table'], {
       //    queryParams: queryParam,
       //  });
         break;
     }
   }

   actions(event: Data) {
    let type: string = event['event'];
    let id: string = event['data'].id;
    const queryParam = { id: id };
    switch (type) {
      case 'delete':
        this.employeeService.deleteEmployeeVisa(id).subscribe(
          (response: ApiResponse) => {
            this.employeeService.notify('Employee visa details Deleted successfully..!');
            const currentPage = Number(this.params.get('page'));
            if (this.employeeVisaMetaData.content.length === 1 && currentPage > 0) {
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
         }
  }

 
   searchFunction(params: HttpParams) {
    //let id=1;    
     this.params = params;
    // console.log("params", this.params);
     this.employeeService
       .searchVisa(params,this.emp_id)
       .subscribe(
         (data: { content: Array<Visa>; totalElements: number }) => {
           //console.log("visadetails",data);
          // console.log(data.totalElements);
           this.employeeVisaMetaData = data;
         }
       );
   }

   OpenModal() {
    this.matDialogRef = this.matDialog.open(EmployeeVisaDetailsFormComponent, {
      width: '500px',
      panelClass: 'my-dialog',
      disableClose: true,
    });

    

   /* this.matDialogRef.afterClosed().subscribe((res: any) => {
      this.searchFunction(this.params);

      if (res == true) {
      }
    });*/
  }

  OpenModalForEdit(id: string) {
    this.matDialogRef = this.matDialog.open(EmployeeVisaDetailsFormComponent, {
      data: { id: id , actionLabel: 'Save'},
      width: '500px',
      panelClass: 'my-dialog',
      disableClose: true,
    });

    this.matDialogRef.afterClosed().subscribe((res: any) => {
      this.searchFunction(this.params);

      if (res == true) {
      }
    });
  }
}
