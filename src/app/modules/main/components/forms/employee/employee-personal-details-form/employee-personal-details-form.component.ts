import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Data, Router } from '@angular/router';
import { CustomValidators } from 'src/app/modules/main/services/custom-validators.service';
import { EmployeeService } from 'src/app/modules/main/services/employee.service';
//import { Employee } from 'src/app/modules/main/models/employee.model';
import { EmployeePersonalDetails } from 'src/app/modules/main/models/employee-personal-details';

@Component({
  selector: 'app-employee-personal-details-form',
  templateUrl: './employee-personal-details-form.component.html',
  styleUrls: ['./employee-personal-details-form.component.scss']
})
export class EmployeePersonalDetailsFormComponent {
  employee: EmployeePersonalDetails;

  employeeForm!: FormGroup;
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
    this.initForm();
    this.selectedIndex=1;
  }

  initForm() {
    this.employeeForm = this.formBuilder.group({
      id: [''],
      marital_status:[''],
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

  onSubmit() {
    console.log("dfd",this.inputFromParent);

 
    if (this.employeeForm.valid) {
      const formData = this.employeeForm.value;
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
