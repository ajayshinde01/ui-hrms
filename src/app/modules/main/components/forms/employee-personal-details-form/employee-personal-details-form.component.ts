import { Component, Input, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Data, Router } from '@angular/router';
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
  emp_id:any;
  visaid:number;
  isDisabled: boolean = false;
  @Input() inputFromParent : string;
  files: File[];
  FleSizeError: string;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    public employeeService: EmployeeService,
    private route: ActivatedRoute,

  ) {}

  ngOnInit(): void {
    this.emp_id = this.route.snapshot.queryParamMap.get('id'); // Replace 'paramName' with the actual query parameter name
    this.selectedIndex=1;
    this.initForm();
    this.fetchMaritalStatus();
    this.fetchBloodGroup();
    this.collectQueryParams();

  }

  initForm() {
    this.employeePersonalDetailsForm = this.formBuilder.group({
      id: [''],
      maritalStatus:[''],
      bloodGroup:[''],
      familyBackground: [
        '',
        [
        //  Validators.required,
        //  CustomValidators.noLeadingSpace(),
        //  CustomValidators.whitespaceValidator(),
        //  CustomValidators.noTrailingSpace(),
       //   CustomValidators.maxLength(10),
        //  Validators.pattern('^[A-Z0-9\\s\\-]+$'),
        ],
      ],
      healthDetails:[''],
      cprNumber:[''],
      gosi:[''],
      aadhaarNumber:[''],
      aadhaarName:[''],
      passportNumber:[''],
      aadhaarFile:[''],
      passportName:[''],
      passportIssueDate:[''],
      passportValidity:[''],
      passportFile:['',Validators.required],
      placeOfIssue:[''],
      panCardNumber:[''],
      panCardName:[''],
      panCardFile:[''],
      bankAccountNumber:[''],
      bankName:[''],
      ifscCode:[''],
      uanNumber:[''],
      pfNumber:[''],
      createdBy: ['Admin'],
      updatedBy: ['Admin'],
      createdAt: [null],
      updatedAt: [null],
      orgCode: "AVI01"

    });
  }

  collectQueryParams() {
    /* this.route.queryParams.subscribe((params) => {
       this.queryParams = params;
 
       if (this.queryParams['id'] != undefined) {
         console.log(this.queryParams['id']);
         this.actionLabel = 'Update';
         this.getById(this.queryParams['id']);
         this.isDisabled = true;
       } else {
         this.actionLabel = 'Save';
       }
     });*/
     if (this.emp_id != undefined) {
       this.actionLabel = 'Update';
       this.getById(this.emp_id);
       this.isDisabled = true;
     } else {
       this.actionLabel = 'Save';
     }

   }

   getById(id: string) {
    this.employeeService
      .searchPersonalDetailsById(this.emp_id)
      .subscribe((response: EmployeePersonalDetails) => {
        this.employeePersonalDetailsForm.patchValue(response);
        this.employee = response;
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

  openPanFileInput(panfileInput: any) {
    panfileInput.click();
  }

  onPanFileSelect(event:any) {
    if (event.target.files.length > 0) {
      this.files = event.target.files[0];
      //this.employeeVisaDetailsForm.get('visaFile').setValue(this.files);
      console.log(this.files);
    }
  }

  openPassportFileInput(passportfileInput: any) {
    passportfileInput.click();
  }

  onPassportFileSelect(event:any) {
    if (event.target.files.length > 0) {
      this.files = event.target.files[0];
      const file = event.target.files[0];
      console.log('size', file.size);
      console.log('type', file.type);
      if(file.size > 2e+6){
        this.FleSizeError='File is too large should not exceed Over 2MB';
        console.log('File is too large. Over 2MB');
      }
   
      //this.employeeVisaDetailsForm.get('visaFile').setValue(this.files);
      console.log(this.files);
    }
  }

  openAadharFileInput(aadharfileInput: any) {
    aadharfileInput.click();
  }

  onAadharFileSelect(event:any) {
    if (event.target.files.length > 0) {
      this.files = event.target.files[0];
      //this.employeeVisaDetailsForm.get('visaFile').setValue(this.files);
      console.log(this.files);
    }
  }

  onSubmit() {
    console.log("dfd",this.inputFromParent);
    if (this.employeePersonalDetailsForm.valid) {
      const formData = this.employeePersonalDetailsForm.value;
      if (this.actionLabel === 'Save') {
        this.employeeService.AddPersonalDetails(formData,this.emp_id).subscribe(
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
        this.employeeService.updateEmployeePersonalDetails(formData,this.emp_id).subscribe(
          (response: EmployeePersonalDetails) => {
            this.employeeService.notify('Update Successfully...');
            this.router.navigate(['/main/employee-table']);
          },
          (error: any) => {
            if (error.status == 400 || error.status == 404) {
              this.employeeService.warn('Credentials already present');
            }
          }
        );
      }
    }
  }
}
