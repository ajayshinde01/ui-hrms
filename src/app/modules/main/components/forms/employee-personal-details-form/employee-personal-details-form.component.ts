import { Component, Input, ViewEncapsulation } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
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
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    public employeeService: EmployeeService,
    private route: ActivatedRoute,
    private fileUploadService: FileUploadService
  ) {}

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
      familyBackground: [''],
      healthDetails: [''],
      cprNumber: [
        '',
        [
          CustomValidators.noLeadingTrailingSpace(),
          CustomValidators.noLeadingSpace(),
          CustomValidators.noWhiteSpace(),
          CustomValidators.noTrailingSpace(),
          CustomValidators.maxLength(10),
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
          CustomValidators.maxLength(9),
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
          CustomValidators.maxLength(16),
          Validators.pattern('^[0-9]{12}$'),
        ],
      ],

      aadhaarName: [
        '',
        [
          CustomValidators.noLeadingTrailingSpace(),
          CustomValidators.noLeadingSpace(),
          CustomValidators.noWhiteSpace(),
          CustomValidators.noTrailingSpace(),
        ],
      ],
      passportNumber: [
        '',
        [
          CustomValidators.noLeadingTrailingSpace(),
          CustomValidators.noLeadingSpace(),
          CustomValidators.noWhiteSpace(),
          CustomValidators.noTrailingSpace(),
          CustomValidators.maxLength(20),
          Validators.pattern('^[A-Za-z0-9]*$'),
        ],
      ],
      aadhaarFile: [''],
      passportName: [
        '',
        [
          CustomValidators.noLeadingTrailingSpace(),
          CustomValidators.noLeadingSpace(),
          CustomValidators.noWhiteSpace(),
          CustomValidators.noTrailingSpace(),
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
        ],
      ],
      panCardNumber: [
        '',
        [
          CustomValidators.noLeadingTrailingSpace(),
          CustomValidators.noLeadingSpace(),
          CustomValidators.noWhiteSpace(),
          CustomValidators.noTrailingSpace(),
          CustomValidators.maxLength(10),
          // Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')
        ],
      ],
      panCardName: [
        '',
        [
          CustomValidators.noLeadingTrailingSpace(),
          CustomValidators.noLeadingSpace(),
          CustomValidators.noWhiteSpace(),
          CustomValidators.noTrailingSpace(),
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
          CustomValidators.maxLength(17),
          Validators.pattern('^[0-9]{9,18}$'),
        ],
      ],
      bankName: [''],
      ifscCode: [
        '',
        [
          CustomValidators.noLeadingTrailingSpace(),
          CustomValidators.noLeadingSpace(),
          CustomValidators.noWhiteSpace(),
          CustomValidators.noTrailingSpace(),
          CustomValidators.maxLength(11),
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
          CustomValidators.maxLength(12),
        ],
      ],
      pfNumber: [
        '',
        [
          CustomValidators.noLeadingTrailingSpace(),
          CustomValidators.noLeadingSpace(),
          CustomValidators.noWhiteSpace(),
          CustomValidators.noTrailingSpace(),
          CustomValidators.maxLength(22),
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
      console.log('size', panfile.size);
      console.log('type', panfile.type);
      if (panfile.size > 2e6) {
        this.FleSizeError = 'File is too large should not exceed Over 2MB';
        console.log('File is too large. Over 2MB');
      }

      if (panfile) {
        this.fileUploadService.uploadImage(panfile).subscribe((res) => {
          console.log('received response', res);
          this.aadhar_file_url = res['message'];
          this.viewPANFile = res['message'];
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
      if (file.size > 2e6) {
        this.FleSizeError = 'File is too large should not exceed Over 2MB';
        console.log('File is too large. Over 2MB');
      }

      if (file) {
        this.fileUploadService.uploadImage(file).subscribe((res) => {
          this.passport_file_url = res['message'];
          this.file_name = res['message'];
          this.viewPassportFile = res['message'];
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
      if (aadharfile.size > 2e6) {
        this.FleSizeError = 'File is too large should not exceed Over 2MB';
      }

      if (aadharfile) {
        this.fileUploadService.uploadImage(aadharfile).subscribe((res) => {
          this.aadhar_file_url = res['message'];
          // this.file_name = res['message'];
          this.viewAadharFile = res['message'];
        });
      }
    }
  }

  onSubmit() {
    // console.log("dfd",this.inputFromParent);
    if (this.employeePersonalDetailsForm.valid) {
      const formData = {
        ...this.employeePersonalDetailsForm.value,
        confirmationDate: moment(
          this.employeePersonalDetailsForm.value.passportIssueDate
        )
          .utcOffset(0, true)
          .format('YYYY-MM-DD'),
      };

      this.employeePersonalDetailsForm.value.passportFile =
        this.passport_file_url;
      this.employeePersonalDetailsForm.value.aadhaarFile = this.aadhar_file_url;
      this.employeePersonalDetailsForm.value.panCardFile = this.aadhar_file_url;

      if (this.actionLabel === 'Save') {
        this.employeeService
          .AddPersonalDetails(formData, this.emp_id)
          .subscribe(
            (response: EmployeePersonalDetails) => {
              this.employeeService.notify('Data Saved Successfully...');
              this.router.navigate(['/master/employee-form']);
              this.actionLabel = 'Update';
            },
            (error: any) => {
              if (error.status == 400 || error.status == 404) {
                this.employeeService.warn('Credentials already present');
              }
            }
          );
      }
      if (this.actionLabel === 'Update') {
        this.employeeService
          .updateEmployeePersonalDetails(formData, this.emp_id)
          .subscribe(
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
