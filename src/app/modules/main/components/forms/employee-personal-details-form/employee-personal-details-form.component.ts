import { Component, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Data, Router } from '@angular/router';
import { CustomValidators } from 'src/app/modules/main/services/custom-validators.service';
import { EmployeeService } from 'src/app/modules/main/services/employee.service';
//import { Employee } from 'src/app/modules/main/models/employee.model';
import { EmployeePersonalDetails } from 'src/app/modules/main/models/employee-personal-details';
import { CommonMaster } from 'src/app/modules/main/models/common-master.model';

@Component({
  selector: 'app-employee-personal-details-form',
  templateUrl: './employee-personal-details-form.component.html',
  styleUrls: ['./employee-personal-details-form.component.scss'],

})
export class EmployeePersonalDetailsFormComponent {
  employee: EmployeePersonalDetails;
  marital_statuses: CommonMaster[] = [];
  blood_group: CommonMaster[] = [];
  employeePersonalDetailsForm!: FormGroup;
  selectedIndex: any;
  clickedTabIndex: any;
  actionLabel: string = 'Save';

  @Input() inputFromParent : string;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    public employeeService: EmployeeService,

  ) {}

  ngOnInit(): void {
    
    this.fetchMaritalStatus();
    this.fetchBloodGroup();
    this.selectedIndex=1;
    this.initForm();
  }

  initForm() {
    this.employeePersonalDetailsForm = this.formBuilder.group({
      id: [''],
      maritalStatus:[''],
      blood_group:[''],
      cpr_number:[''],
      family_background: [
        '',
        [
          Validators.required,
        //  CustomValidators.noLeadingSpace(),
        //  CustomValidators.whitespaceValidator(),
        //  CustomValidators.noTrailingSpace(),
       //   CustomValidators.maxLength(10),
        //  Validators.pattern('^[A-Z0-9\\s\\-]+$'),
        ],
      ],
      health_details:[''],
      gosi:[''],
      passport_number:[''],
      passport_name:[''],
      dateOfIssue:[''],
      validUpto:[''],
      placeOfIssue:[''],
      aadhar_number:[''],
      aadhar_name:[''],
      createdBy: ['Admin'],
      updatedBy: ['Admin'],
      createdAt: [null],
      updatedAt: [null],
    });
  }
  nextStep() {
    console.log("sdfdsf",this.selectedIndex);
    this.selectedIndex =2;
  }

  fetchMaritalStatus() {
    this.employeeService.getMaritalStatus().subscribe((Response: Array<CommonMaster>)=>{
      this.marital_statuses =Response;
     // console.log(this.marital_statuses);
    })
  }

  fetchBloodGroup() {
    this.employeeService.getBloodGroup().subscribe((Response: Array<CommonMaster>)=>{
      this.blood_group =Response;
      console.log(this.blood_group);
    })
  }

  onSubmit() {
    console.log("dfd",this.inputFromParent);

 
    if (this.employeePersonalDetailsForm.valid) {
      const formData = this.employeePersonalDetailsForm.value;
      if (this.actionLabel === 'Save') {
        this.employeeService.AddPersonalDetails(formData).subscribe(
          (response: EmployeePersonalDetails) => {
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
