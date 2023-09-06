import { Component, ElementRef, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { CustomValidators } from 'src/app/modules/main/services/custom-validators.service';
import { EmployeeService } from 'src/app/modules/main/services/employee.service';
//import { Employee } from 'src/app/modules/main/models/employee.model';
import { EmployeePersonalDetails } from 'src/app/modules/main/models/employee-personal-details';
import { CommonMaster } from 'src/app/modules/main/models/common-master.model';
import { FileUploadService } from '../../../services/file-upload.service';
import * as moment from 'moment';

@Component({
  selector: 'app-employee-personal-details-form',
  templateUrl: './employee-personal-details-form.component.html',
  styleUrls: ['./employee-personal-details-form.component.scss']
})
export class EmployeePersonalDetailsFormComponent {
  employee: EmployeePersonalDetails;
  marital_statuses: CommonMaster[] = [];
  blood_group: CommonMaster[] = [];
  employeePersonalDetailsForm!: FormGroup;
  selectedIndex: any;
  clickedTabIndex: any;
  actionLabel: string = 'Save';
  emp_id: any;
  visaid: number;
  isDisabled: boolean = false;
  @Input() inputFromParent: string;
  files: File[];
  FleSizeError: string;
  url: any;
  file_name: any;
  orgCode = sessionStorage.getItem('orgCode');

  viewPassportFile: any;
  aadhar_url: any;
  passport_file_url: any;
  aadhar_file_url: any;
  viewAadharFile: any;
  viewPANFile: any;
  todayDate: Date = new Date();
  validate: boolean;
  @ViewChild('passportNameInputElement') passportNameInput!: ElementRef;
  warningMessage: boolean;
  passportFileError: boolean;
  AadharFileSizeError: string;
  aadharFileError: boolean;
  PANFleSizeError: string;
  panFileError: boolean;
  warningMessageForPersonalDetails: boolean;
  warningMessageForPassport: boolean;
  warningMessageForAadhar: boolean;
  warningMessageForPAN: boolean;
  warningMessageForPF: boolean;
  warningMessageForBank: boolean;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    public employeeService: EmployeeService,
    private route: ActivatedRoute,
    private fileUploadService: FileUploadService
  ) { }

  ngOnInit(): void {
    this.emp_id = this.route.snapshot.queryParamMap.get('id'); // Replace 'paramName' with the actual query parameter name
    this.selectedIndex = 1;
    this.initForm();
    this.fetchMaritalStatus();
    this.fetchBloodGroup();
    this.collectQueryParams();
    this.todayDate = new Date();
  }

  initForm() {
    this.employeePersonalDetailsForm = this.formBuilder.group({
      id: [''],
      maritalStatus: [''],
      bloodGroup: [''],
      familyBackground: ['',[Validators.maxLength(100), Validators.pattern('^[A-Za-z., ]*$'),]],
      healthDetails: ['',[Validators.maxLength(100), Validators.pattern('^[A-Za-z., ]*$'),]],
      cprNumber: [
        '',
        [
          CustomValidators.noLeadingTrailingSpace(),
          CustomValidators.noLeadingSpace(),
          CustomValidators.noWhiteSpace(),
          CustomValidators.noTrailingSpace(),
          //  CustomValidators.maxLength(10),
          Validators.maxLength(10),
          Validators.pattern('^[0-9]*$'),
          // Validators.pattern('^(0[1-9]|[12]\d|3[01])(0[1-9]|1[0-2])\d{2}[-]?\d{4}$')
        ],
      ], //1610721012
      gosi: [
        '',
        [
          CustomValidators.noLeadingTrailingSpace(),
          CustomValidators.noLeadingSpace(),
          CustomValidators.noWhiteSpace(),
          CustomValidators.noTrailingSpace(),
          // CustomValidators.maxLength(9),
          Validators.maxLength(9),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      aadhaarNumber: [
        '',
        [
          CustomValidators.noLeadingTrailingSpace(),
          CustomValidators.noLeadingSpace(),
          CustomValidators.noWhiteSpace(),
          CustomValidators.noTrailingSpace(),
          //CustomValidators.maxLength(16),
          Validators.maxLength(12),
          Validators.pattern('^[0-9]{12}$'),
        ],
      ],

      aadhaarName: [
        '',
        [
          CustomValidators.noLeadingTrailingSpace(),
          CustomValidators.noLeadingSpace(),
          CustomValidators.noTrailingSpace(),
          Validators.maxLength(100),
          Validators.pattern('^[A-Za-z ]*$'),
        ],
      ],
      passportNumber: [
        '',
        [
          CustomValidators.noLeadingTrailingSpace(),
          CustomValidators.noLeadingSpace(),
          CustomValidators.noWhiteSpace(),
          CustomValidators.noTrailingSpace(),
          // CustomValidators.maxLength(20),
          Validators.maxLength(20),
          Validators.pattern('^[A-Za-z0-9]*$'),
        ],
      ],
      aadhaarFile: [''],
      passportName: [
        '',
        [
          CustomValidators.noLeadingTrailingSpace(),
          CustomValidators.noLeadingSpace(),
          CustomValidators.noTrailingSpace(),
          Validators.maxLength(100),
          Validators.pattern('^[A-Za-z ]*$'),
        ],
      ],
      passportIssueDate: [
        '',
        [CustomValidators.passportIssueDate(this.todayDate)],
      ],
      passportValidity: [
        '',
        [CustomValidators.valdiationOfPassport(this.todayDate)],
      ],
      passportFile: [''],
      placeOfIssue: [
        '',
        [
          CustomValidators.noLeadingTrailingSpace(),
          CustomValidators.noLeadingSpace(),
          CustomValidators.noWhiteSpace(),
          CustomValidators.noTrailingSpace(),
          Validators.maxLength(50),
          Validators.pattern('^[A-Za-z ]*$'),
        ],
      ],
      panCardNumber: [
        '',
        [
          CustomValidators.noLeadingTrailingSpace(),
          CustomValidators.noLeadingSpace(),
          CustomValidators.noWhiteSpace(),
          CustomValidators.noTrailingSpace(),
          //CustomValidators.maxLength(10),
          Validators.maxLength(10),
          Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}'),
        ],
      ],
      panCardName: [
        '',
        [
          CustomValidators.noLeadingTrailingSpace(),
          CustomValidators.noLeadingSpace(),
          CustomValidators.noTrailingSpace(),
          Validators.maxLength(100),
          Validators.pattern('^[A-Za-z ]*$'),
        ],
      ],
      panCardFile: [''],
      bankAccountNumber: [
        '',
        [
          CustomValidators.noLeadingTrailingSpace(),
          CustomValidators.noLeadingSpace(),
          CustomValidators.noWhiteSpace(),
          CustomValidators.noTrailingSpace(),
          // CustomValidators.maxLength(17),
          Validators.maxLength(17),
          Validators.pattern('^[0-9]{9,18}$'),
        ],
      ],
      bankName: ['',
      [Validators.maxLength(100),Validators.pattern('^[A-Za-z]*$'),]],
      ifscCode: [
        '',
        [
          CustomValidators.noLeadingTrailingSpace(),
          CustomValidators.noLeadingSpace(),
          CustomValidators.noWhiteSpace(),
          CustomValidators.noTrailingSpace(),
          //CustomValidators.maxLength(11),
          Validators.maxLength(11),
          Validators.pattern('^[A-Z]{4}0[A-Z0-9]{6}$'),
        ],
      ],
      uanNumber: [
        '',
        [
          CustomValidators.noLeadingTrailingSpace(),
          CustomValidators.noLeadingSpace(),
          CustomValidators.noWhiteSpace(),
          CustomValidators.noTrailingSpace(),
          // CustomValidators.maxLength(12),
          Validators.maxLength(12),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      pfNumber: [
        '',
        [
          CustomValidators.noLeadingTrailingSpace(),
          CustomValidators.noLeadingSpace(),
          CustomValidators.noWhiteSpace(),
          CustomValidators.noTrailingSpace(),
          //CustomValidators.maxLength(22),
          Validators.maxLength(22),
          Validators.pattern('^[A-Za-z0-9]*$'),
          //  Validators.pattern('^[A-Z]{2}[\s\/]?[A-Z]{3}[\s\/]?[0-9]{7}[\s\/]?[0-9]{3}[\s\/]?[0-9]{7}$')
        ],
      ],
      createdBy: ['Admin'],
      updatedBy: ['Admin'],
      createdAt: [null],
      updatedAt: [null],
      orgCode: this.orgCode,
    });
  }

  //passportNumber = <FormControl>this.employeePersonalDetailsForm.get('passportNumber');
  //passportame = <FormControl>this.employeePersonalDetailsForm.get('passportNumber');
  //this.employeePersonalDetailsForm.value.passportNumber
  //if(this.employeePersonalDetailsForm.value.passportNumber !== ''){
  //  this.employeePersonalDetailsForm.value.passportNumber.addValidators(Validators.required);               
  // } else {                
  // <FormControl>this.employeePersonalDetailsForm.get('passportame').clearValidators();               
  //}

  addValidationForPersonalFields(value:any){
     if(value!==''){
     this.employeePersonalDetailsForm.controls["bloodGroup"].addValidators([Validators.required]);
     this.employeePersonalDetailsForm.controls["familyBackground"].addValidators([Validators.required]);
     this.employeePersonalDetailsForm.controls["healthDetails"].addValidators([Validators.required]);
     this.employeePersonalDetailsForm.controls["cprNumber"].addValidators([Validators.required]);
     this.employeePersonalDetailsForm.controls["gosi"].addValidators([Validators.required]);

     if(!this.warningMessageForPersonalDetails){
       this.warningMessageForPersonalDetails=true;
       this.employeeService.warn(
         'Please enter all details for personal'
       );
     }
     }
     else {                
      this.warningMessageForPersonalDetails=false;
      this.employeePersonalDetailsForm.controls["bloodGroup"].removeValidators([Validators.required]);
      this.employeePersonalDetailsForm.controls["familyBackground"].removeValidators([Validators.required]);
      this.employeePersonalDetailsForm.controls["healthDetails"].removeValidators([Validators.required]);
      this.employeePersonalDetailsForm.controls["cprNumber"].removeValidators([Validators.required]);
      this.employeePersonalDetailsForm.controls["gosi"].removeValidators([Validators.required]);
      }
     
      this.employeePersonalDetailsForm.controls['bloodGroup'].updateValueAndValidity();
      this.employeePersonalDetailsForm.controls['familyBackground'].updateValueAndValidity();
      this.employeePersonalDetailsForm.controls['healthDetails'].updateValueAndValidity();
      this.employeePersonalDetailsForm.controls['cprNumber'].updateValueAndValidity();
      this.employeePersonalDetailsForm.controls['gosi'].updateValueAndValidity();

  }



  addValidationForPassportFields(value: any){
    if(value!==''){
    //  this.employeePersonalDetailsForm.get('passportName').setValidators([Validators.required, Validators.minLength(3)]);;    
    //this.employeePersonalDetailsForm.get('passportName')?.setValidators([Validators.required,Validators.maxLength(10)])
    this.employeePersonalDetailsForm.controls["passportName"].addValidators([Validators.required]);
    this.employeePersonalDetailsForm.controls["passportIssueDate"].addValidators([Validators.required]);
    this.employeePersonalDetailsForm.controls["passportValidity"].addValidators([Validators.required]);
    this.employeePersonalDetailsForm.controls["placeOfIssue"].addValidators([Validators.required]);
    if(!this.viewPassportFile){
      this.passportFileError=true;
    }else{
      this.passportFileError=false;
    }

    if(!this.warningMessageForPassport){
      this.warningMessageForPassport=true;
      this.employeeService.warn(
        'Please enter all details for Passport'
      );
    }
    }
    else {                
     // this.employeePersonalDetailsForm.value.passportName.clearValidators();               
     this.warningMessageForPassport=false;
     this.employeePersonalDetailsForm.controls["passportName"].removeValidators([Validators.required]);
     this.employeePersonalDetailsForm.controls["passportIssueDate"].removeValidators([Validators.required]);
    this.employeePersonalDetailsForm.controls["passportValidity"].removeValidators([Validators.required]);
    this.employeePersonalDetailsForm.controls["placeOfIssue"].removeValidators([Validators.required]);
     }
     setTimeout(()=>{ // this will make the execution after the above boolean has changed
      if(this.passportNameInput){
     //   this.passportNameInput.nativeElement.focus();
      }
  },1000);  
    
     this.employeePersonalDetailsForm.controls['passportName'].updateValueAndValidity();
    // this.employeePersonalDetailsForm.get('passportame').focus();
   // this.employeePersonalDetailsForm.controls['passportName'].


  }

  addValidationForAadharFields(value:any){//event:any
     if(value!==''){
     this.employeePersonalDetailsForm.controls["aadhaarName"].addValidators([Validators.required]);
     if(!this.viewAadharFile){
       this.aadharFileError=true;
     }else{
       this.aadharFileError=false;
     }
 
     if(!this.warningMessageForAadhar){
       this.warningMessageForAadhar=true;
       this.employeeService.warn(
         'Please enter all details for Aadhar'
       );
     }
     }
     else {                
      this.warningMessageForAadhar=false;
      this.employeePersonalDetailsForm.controls["aadhaarName"].removeValidators([Validators.required]);
      }
     
      this.employeePersonalDetailsForm.controls['aadhaarName'].updateValueAndValidity();
  }

  addValidationForPANFields(value:any){
     if(value!==''){
     this.employeePersonalDetailsForm.controls["panCardName"].addValidators([Validators.required]);

 
     if(!this.warningMessageForPAN){
       this.warningMessageForPAN=true;
       this.employeeService.warn(
         'Please enter all details for PAN'
       );
     }
     }
     else {                
      this.warningMessageForPAN=false;
      this.employeePersonalDetailsForm.controls["panCardName"].removeValidators([Validators.required]);
      }
     
      this.employeePersonalDetailsForm.controls['panCardName'].updateValueAndValidity();
  }

  addValidationForPFFields(value:any){
     if(value!==''){
     this.employeePersonalDetailsForm.controls["pfNumber"].addValidators([Validators.required]);
 
     if(!this.warningMessageForPF){
       this.warningMessageForPF=true;
       this.employeeService.warn(
         'Please enter all details for PF'
       );
     }
     }
     else {                
      this.warningMessageForPF=false;
      this.employeePersonalDetailsForm.controls["pfNumber"].removeValidators([Validators.required]);
      }
     
      this.employeePersonalDetailsForm.controls['pfNumber'].updateValueAndValidity();
  }

  addValidationForBankFields(value:any){
     if(value!==''){
     this.employeePersonalDetailsForm.controls["bankName"].addValidators([Validators.required]);
     this.employeePersonalDetailsForm.controls["ifscCode"].addValidators([Validators.required]);
     
     if(!this.warningMessageForBank){
       this.warningMessageForBank=true;
       this.employeeService.warn(
        'Please enter all details for Bank'
       );
     }
     }
     else {                
      this.warningMessageForBank=false;
      this.employeePersonalDetailsForm.controls["bankName"].removeValidators([Validators.required]);
      this.employeePersonalDetailsForm.controls["ifscCode"].removeValidators([Validators.required]);
      }
     
      this.employeePersonalDetailsForm.controls['bankName'].updateValueAndValidity();
      this.employeePersonalDetailsForm.controls['ifscCode'].updateValueAndValidity();
  }


  validIssueDate(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const today = new Date().getTime();
      console.log('validIssueDate', control.value);
      if (!(control && control.value)) {
        // if there's no control or no value, that's ok
        return null;
      }

      // return null if there's no errors
      return control.value.getTime() < today
        ? { invalidIssueDate: 'Passport Issue Date should be a future date' }
        : null;
    };
  }

  validpassportValidityDate(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const today = new Date().getTime();
      console.log('validpassportValidityDate', control.value);
      if (!(control && control.value)) {
        // if there's no control or no value, that's ok
        return null;
      }

      // return null if there's no errors
      return control.value.getTime() < today
        ? { invalidValidityDate: 'Valid Upto should be a future date' }
        : null;
    };
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.employeePersonalDetailsForm.get(controlName);

    return !!control && control.invalid && control.touched;
  }

  getErrorMessage(controlName: string): string {
    const control = this.employeePersonalDetailsForm.get(controlName);

    console.log('controlName' + controlName);
    if (control && control.errors) {
      const errorKey = Object.keys(control.errors)[0];

      const value = Object.values(control.errors)[0];
      return CustomValidators.getErrorMessage(errorKey, controlName);
    }

    return '';
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
      this.getById(this.emp_id);
      this.isDisabled = true;
      //  this.actionLabel = 'Update';
    } else {
      // this.actionLabel = 'Save';
    }
    console.log('emp_id action label', this.emp_id, this.actionLabel);
  }

  getById(id: string) {
    this.employeeService.searchPersonalDetailsById(this.emp_id).subscribe(
      (response: EmployeePersonalDetails) => {
        this.employeePersonalDetailsForm.patchValue(response);
        console.log(response);
        this.employee = response;
        this.viewPANFile = response['panCardFile'];
        this.viewAadharFile = response['aadhaarFile'];
        this.viewPassportFile = response['passportFile'];
        this.actionLabel = 'Update';
      },
      (err) => {
        this.actionLabel === 'Save';
        console.log('oops', err);
      }
    );
  }

  nextStep() {
    console.log('sdfdsf', this.selectedIndex);
    this.selectedIndex = 2;
  }

  fetchMaritalStatus() {
    this.employeeService
      .getMaritalStatus()
      .subscribe((Response: Array<CommonMaster>) => {
        this.marital_statuses = Response;
        // console.log(this.marital_statuses);
      });
  }

  fetchBloodGroup() {
    this.employeeService
      .getBloodGroup()
      .subscribe((Response: Array<CommonMaster>) => {
        this.blood_group = Response;
        console.log(this.blood_group);
      });
  }

  openPanFileInput(panfileInput: any) {
    panfileInput.click();
  }

  onPanFileSelect(event: any) {
    if (event.target.files.length > 0) {
      this.files = event.target.files[0];
      console.log(this.files);
      const panfile = event.target.files[0];
      if (panfile.size > 1e6) {
        this.PANFleSizeError = 'File is too large should not exceed Over 1MB';
        console.log('File is too large. Over 1MB');
      }

      if (panfile) {
        if(this.viewPANFile){
          const lastEqualSignIndex = this.viewPANFile.lastIndexOf('=');
          const filename = this.viewPANFile.substr(lastEqualSignIndex + 1);
          
          this.fileUploadService.removeImage(filename).subscribe((res) => {
            console.log("pan file removed");
          });
        }
        this.fileUploadService.uploadImage(panfile).subscribe((res) => {
          console.log('received response', res);
          this.aadhar_file_url = res['message'];
          this.viewPANFile = res['message'];

          if(this.viewPANFile){
            this.panFileError=false;
          }else{
            this.panFileError=true;
          }
        });
      }
    }
  }

  openPassportFileInput(passportfileInput: any) {
    passportfileInput.click();
  }

  onPassportFileSelect(event: any) {
    if (event.target.files.length > 0) {
      this.files = event.target.files[0];
      const file = event.target.files[0];
      if (file.size > 1e6) {
        this.FleSizeError = 'File is too large should not exceed Over 1MB';
        console.log('File is too large. Over 1MB');
      }

      if (file) {
        if(this.viewPassportFile){
          const lastEqualSignIndex = this.viewPassportFile.lastIndexOf('=');
          const filename = this.viewPassportFile.substr(lastEqualSignIndex + 1);
          
          this.fileUploadService.removeImage(filename).subscribe((res) => {
            console.log("passport file removed");
          });
        }
        this.fileUploadService.uploadImage(file).subscribe((res) => {
          this.passport_file_url = res['message'];
          this.file_name = res['message'];
          this.viewPassportFile = res['message'];
          if(this.viewPassportFile!=''){
            this.passportFileError=false;
          }else{
            this.passportFileError=true;
          }
        });
        
      }
    }
  }

  openAadharFileInput(aadharfileInput: any) {
    aadharfileInput.click();
  }

  onAadharFileSelect(event: any) {
    if (event.target.files.length > 0) {
      this.files = event.target.files[0];
      const aadharfile = event.target.files[0];
      if (aadharfile.size > 1e6) {
        this.AadharFileSizeError = 'File is too large should not exceed Over 1MB';
      }

      if (aadharfile) {
        if(this.viewAadharFile){
          const lastEqualSignIndex = this.viewAadharFile.lastIndexOf('=');
          const filename = this.viewAadharFile.substr(lastEqualSignIndex + 1);
          
          this.fileUploadService.removeImage(filename).subscribe((res) => {
            console.log("aadhar file removed");
          });
        }
        this.fileUploadService.uploadImage(aadharfile).subscribe((res) => {
          this.aadhar_file_url = res['message'];
          // this.file_name = res['message'];
          this.viewAadharFile = res['message'];
          if(this.viewAadharFile){
            this.aadharFileError=false;
          }else{
            this.aadharFileError=true;
          }
        });
      }
    }
  }

  onSubmit() {
   //  console.log("dfd",this.inputFromParent);
    if(this.employeePersonalDetailsForm.value.maritalStatus!=''){
      this.addValidationForPersonalFields(this.employeePersonalDetailsForm.value.maritalStatus);     
    }
    if(this.employeePersonalDetailsForm.value.passportNumber!=''){
      this.addValidationForPassportFields(this.employeePersonalDetailsForm.value.passportNumber);     
    }
    if(this.employeePersonalDetailsForm.value.aadhaarNumber!=''){
      this.addValidationForAadharFields(this.employeePersonalDetailsForm.value.aadhaarNumber);     
    }
    if(this.employeePersonalDetailsForm.value.panCardNumber!=''){
      this.addValidationForPANFields(this.employeePersonalDetailsForm.value.panCardNumber);     
    }
    if(this.employeePersonalDetailsForm.value.uanNumber!=''){
      this.addValidationForPFFields(this.employeePersonalDetailsForm.value.uanNumber);     
    }
    if(this.employeePersonalDetailsForm.value.bankAccountNumber!=''){
      this.addValidationForBankFields(this.employeePersonalDetailsForm.value.bankAccountNumber);     
    }
    if (this.employeePersonalDetailsForm.valid) {
      this.employeePersonalDetailsForm.value.passportFile =
      this.passport_file_url;
      this.employeePersonalDetailsForm.value.aadhaarFile = this.aadhar_file_url;
      this.employeePersonalDetailsForm.value.panCardFile = this.aadhar_file_url;
      const formData = {
        ...this.employeePersonalDetailsForm.value,
        confirmationDate: this.employeePersonalDetailsForm.value
          .passportIssueDate
          ? moment(this.employeePersonalDetailsForm.value.passportIssueDate)
            .utcOffset(0, true)
            .format('YYYY-MM-DD')
          : null,
      };     

      if (this.actionLabel === 'Save') {
        this.employeeService
          .AddPersonalDetails(formData, this.emp_id)
          .subscribe(
            (response: EmployeePersonalDetails) => {
              this.employeeService.notify(
                'Employee Personal Details added successfully'
              );
              this.router.navigate(['/master/employee-form']);
              this.actionLabel = 'Update';
            },
            (error: any) => {
              if (
                error.status == 400 ||
                error.status == 404 ||
                error.status == 500
              ) {
                this.employeeService.warn(
                  'Employee Personal Details already present'
                );
              }
            }
          );
      }
      if (this.actionLabel === 'Update') {
        this.employeeService
          .updateEmployeePersonalDetails(formData, this.emp_id)
          .subscribe(
            (response: EmployeePersonalDetails) => {
              this.employeeService.notify(
                'Employee Personal Details updated successfully'
              );
              this.router.navigate(['/main/employee-table']);
            },
            (error: any) => {
              if (
                error.status == 400 ||
                error.status == 404 ||
                error.status == 500
              ) {
                this.employeeService.warn(
                  'Employee Personal Details already present'
                );
              }
            }
          );
      }
    }
  }
}
