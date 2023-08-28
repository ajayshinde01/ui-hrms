import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonMaster } from 'src/app/modules/main/models/common-master.model';
import { Division } from 'src/app/modules/main/models/division.model';

import { CustomValidators } from 'src/app/modules/main/services/custom-validators.service';
import { DivisionService } from 'src/app/modules/main/services/division.service';
import { EmployeeService } from 'src/app/modules/main/services/employee.service';
import { FileUploadService } from 'src/app/modules/main/services/file-upload.service';
import { MatTab } from '@angular/material/tabs';
import { Employees } from '../../../models/employee.model';

@Component({
  selector: 'app-employee-info',
  templateUrl: './employee-info.component.html',
  styleUrls: ['./employee-info.component.scss'],
})
export class EmployeeInfoComponent implements OnInit {
  employeeForm!: FormGroup;
  employee: Employees;
  submitted: boolean = false;
  queryParams?: Params;
  actionLabel: string = 'Save';
  isDisabled: boolean = false;
  divisions: Division[] = [];
  titles: CommonMaster[] = [];
  genders: CommonMaster[] = [];
  status: CommonMaster[] = [];
  isAgeDisabled: boolean = false;
  age: number;
  selectedDate: Date;
  url: String = '../../../assets/profile-img.jpg';
  @ViewChild('avatarImg', { static: true }) avatarImgElement: ElementRef;
  photo: string;
  photoUpdated: any;
  showAddPhotoOverlay: boolean;
  readonly minAge = 18;
  maxDob: Date;
  labelName: any;
  selectedIndex: number = 0;
  clickedTabIndex: number;
  minDob: Date;

  constructor(
    public employeeService: EmployeeService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private divisionService: DivisionService,
    private fileUploadService: FileUploadService,
    private http: HttpClient
  ) {}
  ngOnInit(): void {
    console.log('employee info');
    this.initForm();
    this.fetchDivisions();
    this.fetchTitles();
    this.fetchGender();
    this.fetchStatus();
    this.route.queryParams.subscribe((params) => {
      this.queryParams = params;
      if (this.queryParams['id'] != undefined) {
        this.actionLabel = 'Update';
        this.getById(this.queryParams['id']);
      } else {
        this.actionLabel = 'Save';
      }
    });
    const today = new Date();
    this.maxDob = new Date(
      today.getFullYear() - this.minAge,
      today.getMonth(),
      today.getDate()
    );
    console.log('maxDob', this.minAge);

    this.minDob = new Date(
      today.getFullYear() - 80,
      today.getMonth(),
      today.getDate()
    );
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.employeeForm.get(controlName);

    return !!control && control.invalid && control.touched;
  }

  getErrorMessage(controlName: string): string {
    const control = this.employeeForm.get(controlName);

    console.log('controlName' + controlName);
    if (control && control.errors) {
      const errorKey = Object.keys(control.errors)[0];

      return CustomValidators.getErrorMessage(errorKey);
    }

    return '';
  }

  fetchStatus() {
    this.employeeService
      .getStatus()
      .subscribe((Response: Array<CommonMaster>) => {
        this.status = Response;
        console.log(this.status);
      });
  }

  fetchGender() {
    this.employeeService
      .getGender()
      .subscribe((Response: Array<CommonMaster>) => {
        this.genders = Response;
        console.log(this.genders);
      });
  }

  fetchTitles() {
    this.employeeService
      .getTitle()
      .subscribe((Response: Array<CommonMaster>) => {
        this.titles = Response;
        console.log(this.titles);
      });
  }

  fetchDivisions() {
    this.divisionService.getDivisions().subscribe(
      (response: Array<Division>) => {
        // Assuming the API response contains an array of division objects
        this.divisions = response;
        console.log(response);
      },
      (error: any) => {
        console.error('Error fetching divisions', error);
      }
    );
  }

  initForm() {
    this.employeeForm = this.formBuilder.group({
      id: [''],
      employeeCode: [
        { value: '', disabled: this.isDisabled },
        [
          Validators.required,
          CustomValidators.noLeadingSpace(),
          CustomValidators.whitespaceValidator(),
          CustomValidators.noTrailingSpace(),
          CustomValidators.maxLength(10),
          Validators.pattern('^[A-Z0-9\\s\\-]+$'),
        ],
      ],
      middleName: [
        '',
        [
          CustomValidators.noLeadingSpace(),
          CustomValidators.whitespaceValidator(),
          CustomValidators.noTrailingSpace(),
          CustomValidators.maxLength(50),
          Validators.pattern('^[A-Za-z]*$'),
          //Validators.pattern('^[A-Za-z\\d][A-Za-z\\d _.-]*[A-Za-z\\d]$|^$'),
        ],
      ],
      title: [''],
      firstName: [
        '',
        [
          Validators.required,
          CustomValidators.noLeadingSpace(),
          CustomValidators.whitespaceValidator(),
          CustomValidators.noTrailingSpace(),
          CustomValidators.maxLength(50),
          Validators.pattern('^[A-Za-z]*$'),
          //Validators.pattern('^[A-Za-z\\d][A-Za-z\\d _.-]*[A-Za-z\\d]$|^$'),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          CustomValidators.noLeadingSpace(),
          CustomValidators.whitespaceValidator(),
          CustomValidators.noTrailingSpace(),
          CustomValidators.maxLength(50),
          Validators.pattern('^[A-Za-z]*$'),
          //Validators.pattern('^[A-Za-z\\d][A-Za-z\\d _.-]*[A-Za-z\\d]$|^$'),
        ],
      ],
      dateOfBirth: ['', Validators.required], // [{ value: '', disabled: this.isAgeDisabled }],
      gender: ['', Validators.required],
      dateOfJoining: ['', Validators.required],
      age: ['', Validators.required],
      status: ['', Validators.required],
      division: this.formBuilder.group({
        id: [''],
      }),
      orgCode: ['AVI01'],
      mobile: [
        '',
        [
          Validators.required,
          CustomValidators.noLeadingSpace(),
          CustomValidators.whitespaceValidator(),
          CustomValidators.noTrailingSpace(),
          CustomValidators.maxLength(10),
          Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),
          //  Validators.pattern('^[0-9]*$'),
          //Validators.pattern('^d{10}$'),
        ],
      ],
      phone: [
        '',
        [
          CustomValidators.noLeadingSpace(),
          CustomValidators.whitespaceValidator(),
          CustomValidators.noTrailingSpace(),
          CustomValidators.maxLength(10),
          Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),
          //  Validators.pattern('^d{10}$'),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          CustomValidators.noLeadingSpace(),
          CustomValidators.whitespaceValidator(),
          CustomValidators.noTrailingSpace(),
          CustomValidators.maxLength(50),
          Validators.pattern(
            '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'
          ),
        ],
      ],
      userId: [''],
      profileImage: [''],
      createdBy: ['Admin'],
      updatedBy: ['Admin'],
      createdAt: [null],
      updatedAt: [null],
    });
  }

  addPhoto(event: any) {
    console.log(event);
    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.avatarImgElement.nativeElement.src = fileReader.result;
    };
    fileReader.readAsDataURL(event.target.files[0]);

    // save the image in the back end database
    // and get the photo url
    this.photo = 'xxxx';
    this.photoUpdated.emit(this.photo);
  }

  openFileInput(fileInput: any) {
    fileInput.click();
    this.showAddPhotoOverlay = false;
  }

  removePhoto() {
    //this.avatarImgElement.nativeElement.src = '';
    //this.photo = '';
    //this.photoUpdated.emit(this.photo);
    console.log('received request', this.photo);
    // let photoUpdated1=this.photo;
    if (this.photo) {
      this.fileUploadService.removeImage(this.photo).subscribe((res) => {
        console.log('received response', res);
        //this.url = res['message'];
        this.url = '../../../assets/profile-img.jpg';
      });
    }
  }
  private getTabIndex(tabName: string): number {
    switch (tabName) {
      case 'Employee Info':
        return 0;
      case 'Company Details':
        return 1;
      case 'Joining Details':
        return 1;
      default:
        return -1;
    }
  }

  selectedTabValue(event: any) {
    this.clickedTabIndex = this.getTabIndex(event.tab.textLabel);
    console.log(event);
    this.labelName = event.tab.textLabel;
    console.log(this.labelName);
  }

  nextStep() {
    console.log('sdfdsf');
    this.selectedIndex = this.clickedTabIndex;
  }
  onSubmit() {
    if (this.employeeForm.valid) {
      const formData = this.employeeForm.value;
      if (this.actionLabel === 'Save') {
        this.employeeService.createEmployee(formData).subscribe(
          (response: Employees) => {
            this.employeeService.notify('Data Saved Successfully...');
            this.router.navigate(['/main/employee-info'], {
              queryParams: { id: response.id, actionLabel: 'Save' },
            });
          },
          (error: any) => {
            if (error.status == 400 || error.status == 404) {
              this.employeeService.warn('Credentials already present');
            }
          }
        );
      }
      if (this.actionLabel === 'Update') {
        this.employeeService.updateEmployee(formData).subscribe(
          (response: Employees) => {
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
  getById(id: string) {
    this.employeeService
      .searchEmployeeById(id)
      .subscribe((response: Employees) => {
        this.employeeForm.patchValue(response);
        // this.employee = response;
      });
  }

  uploadImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fileUploadService.uploadImage(file).subscribe((res) => {
        console.log('received response', res);
        this.url = res['message'];
        this.photo = res['file'];
      });
    }
  }
  calculateAge(event: any) {
    console.log(event.value);
    this.selectedDate = event.value;
    if (this.selectedDate) {
      const today = new Date();
      const birthDate = new Date(this.selectedDate);
      const ageTimeSpan = today.getTime() - birthDate.getTime();
      this.age = Math.floor(ageTimeSpan / (1000 * 60 * 60 * 24 * 365.25));
      this.employeeForm?.get('age')?.setValue(this.age);
      this.isAgeDisabled = true;
      console.log(this.isAgeDisabled);
    }
  }
}
