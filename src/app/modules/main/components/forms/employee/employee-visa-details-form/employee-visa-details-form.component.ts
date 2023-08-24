import { HttpParams } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Data, Router } from '@angular/router';
import { Visa } from 'src/app/modules/main/models/visa.model';
import { EmployeeService } from 'src/app/modules/main/services/employee.service';
import { ColumnsMetadata } from 'src/app/modules/master/models/columnMetaData';

@Component({
  selector: 'app-employee-visa-details-form',
  templateUrl: './employee-visa-details-form.component.html',
  styleUrls: ['./employee-visa-details-form.component.scss']
})
export class EmployeeVisaDetailsFormComponent implements OnInit {
  params: HttpParams = new HttpParams();
  selectedProduct: any;
  @Input() inputFromParent : string;


  constructor(
    private _mdr: MatDialogRef<EmployeeVisaDetailsFormComponent>,
    @Inject(MAT_DIALOG_DATA) data: string,
    private employeeService: EmployeeService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    console.log("dfd",this.inputFromParent);
   
  }
  onSubmit() {
    
   // console.log("dfd",this.inputFromParent);
    
   // this.router.navigate(['/master/grade']);
   
  }

  Close(isUpdate: boolean) {
    this._mdr.close(isUpdate);
  }

}
