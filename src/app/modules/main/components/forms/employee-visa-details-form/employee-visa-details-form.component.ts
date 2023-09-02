import { Component, ElementRef, Inject, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { Visa } from 'src/app/modules/main/models/visa.model';
import { EmployeeService } from 'src/app/modules/main/services/employee.service';
import { CommonMaster } from '../../../models/common-master.model';
import { CustomValidators } from '../../../services/custom-validators.service';
import { FileUploadService } from '../../../services/file-upload.service';
import { ColumnsMetadata } from 'src/app/modules/master/models/columnMetaData';

@Component({
  selector: 'app-employee-visa-details-form',
  templateUrl: './employee-visa-details-form.component.html',
  styleUrls: ['./employee-visa-details-form.component.scss']
})
export class EmployeeVisaDetailsFormComponent implements OnInit {
  params: HttpParams = new HttpParams();
  selectedProduct: any;
  @Input() inputFromParent: string;
  employeeVisaDetailsForm!: FormGroup;
  queryParams?: Params;
  isDisabled: boolean = false;
  country_codes: CommonMaster[] = [];
  actionLabel: string = 'Save';
  visa: Visa;
  emp_id: any;
  visaid: number;
  files: File;
  visaFile: any;
  fileSizeError: string = '';
  url: any;
  file_name: any;
  viewFile: any;

  constructor(
    private _mdr: MatDialogRef<EmployeeVisaDetailsFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Visa,
    private employeeService: EmployeeService,
    private router: Router,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private fileUploadService: FileUploadService
  ) { }

  ngOnInit(): void {
    this.emp_id = this.route.snapshot.queryParamMap.get('id');
    this.initForm();
    this.fetchCountryCode();
    this.collectQueryParams();
    this.getById(this.emp_id);
  }

  initForm() {
    this.employeeVisaDetailsForm = this.formBuilder.group({
      id: [''],
      countryCode: ['', Validators.required],
      orgCode: ['AVI-123'],
      visaNumber: ['', [
        Validators.required,
        CustomValidators.noLeadingSpace(),
        CustomValidators.whitespaceValidator(),
        CustomValidators.noTrailingSpace(),
        CustomValidators.maxLength(20),
        Validators.pattern('^[0-9]*$'),
      ]],
      visaFile: [''],
      validDate: ['', [Validators.required]],
    });
  }


  getErrorMessage(controlName: string): string {
    const control = this.employeeVisaDetailsForm.get(controlName);
    if (control && control.errors) {
      const errorKey = Object.keys(control.errors)[0];
      return CustomValidators.getErrorMessage(errorKey, controlName);
    }
    return '';
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.employeeVisaDetailsForm.get(controlName);
    return !!control && control.invalid && control.touched;
  }

  collectQueryParams() {
    if (this.data.id != undefined && this.data.actionLabel) {
      this.actionLabel = 'Update';
      this.getById(this.emp_id);
      this.isDisabled = true;
    } else {
      this.actionLabel = 'Save';
    }
  }

  getById(id: string) {
    if (this.data != null) {
      this.visaid = this.data.id;
      this.employeeService
        .searchVisaById(this.emp_id, this.visaid)
        .subscribe((response: Visa) => {
          this.employeeVisaDetailsForm.patchValue(response);
          this.employeeVisaDetailsForm.controls["countryCode"].patchValue(response.countryCode);
          this.visa = response;
          this.viewFile = response['visaFile'];
        },
          err => {
            this.actionLabel = 'Update';
            console.log('Oops', err);
          });
    }
  }

  fetchCountryCode() {
    this.employeeService.getCountryCode().subscribe((Response: Array<CommonMaster>) => {
      this.country_codes = Response;
    })
  }

  Close(isUpdate: boolean) {
    this._mdr.close(isUpdate);
  }

  openVisaFileInput(visaFileInput: any) {
    visaFileInput.click();
  }

  onFileSelect(event: any) {
    if (event.target.files.length > 0) {
      this.files = event.target.files[0];
      console.log(this.files);
      const file = event.target.files[0];
      if (file.size > 2e+6) {
        this.fileSizeError = 'File is too large should not exceed Over 1MB';
      } else {
        this.fileSizeError = '';
      }
      if (file) {
        this.fileUploadService.uploadImage(file).subscribe((res) => {
          console.log('Received response', res);
          this.url = res['message'];
          this.file_name = res['message'];
          this.viewFile = res['message'];
        });
      }
    }
  }

  onSubmit() {
    if (this.employeeVisaDetailsForm.valid) {
      this.employeeVisaDetailsForm.value.visaFile = this.file_name;
      const formData = this.employeeVisaDetailsForm.value;
      if (this.actionLabel === 'Save') {
        this.employeeService.AddVisaDetails(formData, this.emp_id).subscribe(
          (response: Visa) => {
            this.employeeService.notify('Data Saved Successfully...');
            this.Close(true);
          },
          (error: any) => {
            if (error.status == 400 || error.status == 404) {
              this.employeeService.warn('Credentials already present');
            }
          }
        );
      }
      if (this.actionLabel === 'Update') {
        this.employeeService.updateEmployeevisa(formData, this.emp_id).subscribe(
          (response: Visa) => {
            this.employeeService.notify('Update Successfully...');
            this.Close(true);
          },
          (error: any) => {
            if (error.status == 400 || error.status == 404) {
              this.employeeService.warn(error.error.message);
            }
          }
        );
      }
    }
  }

  resetForm() {
    this.employeeVisaDetailsForm.reset();
  }
}