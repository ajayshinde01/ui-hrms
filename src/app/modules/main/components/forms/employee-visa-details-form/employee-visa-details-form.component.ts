import { HttpParams } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { Visa } from 'src/app/modules/main/models/visa.model';
import { EmployeeService } from 'src/app/modules/main/services/employee.service';
import { ColumnsMetadata } from 'src/app/modules/master/models/columnMetaData';
import { CommonMaster } from '../../../models/common-master.model';

@Component({
  selector: 'app-employee-visa-details-form',
  templateUrl: './employee-visa-details-form.component.html',
  styleUrls: ['./employee-visa-details-form.component.scss']
})
export class EmployeeVisaDetailsFormComponent implements OnInit {
  params: HttpParams = new HttpParams();
  selectedProduct: any;
  @Input() inputFromParent : string;
  employeeVisaDetailsForm!: FormGroup;
  country_codes: CommonMaster[] = [];
  actionLabel: string = 'Save';
  visa: Visa;
  emp_id:any;

  constructor(
    private _mdr: MatDialogRef<EmployeeVisaDetailsFormComponent>,
    @Inject(MAT_DIALOG_DATA) data: string,
    private employeeService: EmployeeService,
    private router: Router,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,

  ) {}

  ngOnInit(): void {
   // this.emp_id = this.route.snapshot.paramMap.get("id");
   // console.log("emp_id", this.route.snapshot.paramMap);   
    this.fetchCountryCode();
    this.initForm();    
    console.log("dfd",this.inputFromParent);
    this.emp_id = this.route.snapshot.queryParamMap.get('id'); // Replace 'paramName' with the actual query parameter name
    console.log('Query parameter value:', this.emp_id);
   
  }

  initForm() {
      this.employeeVisaDetailsForm = this.formBuilder.group({
        id: [''],
        countryCode:[''],
        orgCode:['AVI-123'],
        visaNumber:[''],
        validDate:[''],
        
      });
    }

  fetchCountryCode() {
    this.employeeService.getCountryCode().subscribe((Response: Array<CommonMaster>)=>{
      this.country_codes =Response;
      console.log(this.country_codes);
    })
  }

  Close(isUpdate: boolean) {
    this._mdr.close(isUpdate);
  }

  onSubmit() {
 
    if (this.employeeVisaDetailsForm.valid) {
      const formData = this.employeeVisaDetailsForm.value;
      if (this.actionLabel === 'Save') {
        this.employeeService.AddVisaDetails(formData,this.emp_id).subscribe(
          (response: Visa) => {
            this.employeeService.notify('Data Saved Successfully...');
            this.router.navigate(['/master/employee-form']);

            
          },
          (error: any) => {
            if (error.status == 400 || error.status == 404) {
              this.employeeService.warn('Credentials already present');
            }
          }
        );
      }
      if (this.actionLabel === 'Update') {
        /*this.employeeService.updateEmployee(formData).subscribe(
          (response: EmployeePersonalDetails) => {
            this.employeeService.notify('Update Successfully...');
            this.router.navigate(['/main/employee-table']);
          },
          (error: any) => {
            if (error.status == 400 || error.status == 404) {
              this.employeeService.warn('Credentials already present');
            }
          }
        );*/
      }
    }
  }

}
