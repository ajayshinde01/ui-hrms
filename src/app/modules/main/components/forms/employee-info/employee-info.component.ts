import { leadingSpaceValidator } from 'src/app/modules/master/components/forms/Validations/leadingSpace.validator';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { CommonMaster } from 'src/app/modules/main/models/common-master.model';
import { Division } from 'src/app/modules/main/models/division.model';
import { CustomValidators } from 'src/app/modules/main/services/custom-validators.service';
import { DivisionService } from 'src/app/modules/main/services/division.service';
import { EmployeeService } from 'src/app/modules/main/services/employee.service';
import { FileUploadService } from 'src/app/modules/main/services/file-upload.service';
import { MatTab } from '@angular/material/tabs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Employees } from '../../../models/employee.model';
import * as moment from 'moment';
import { FirstLetterCapitalService } from 'src/app/modules/shared/services/first-letter-capital.service';
import { DeletePopupComponent } from 'src/app/modules/shared/delete-popup/delete-popup.component';
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
  url: String = 'assets/profile-img.png';
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
  orgCode = sessionStorage.getItem('orgCode');

  errorMessage: any;
  cardDivHeight: any = '';
  cardHeights!: number;
  constructor(
    public employeeService: EmployeeService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private divisionService: DivisionService,
    private fileUploadService: FileUploadService,
    private http: HttpClient,
    private capitalService: FirstLetterCapitalService,
    private dialog: MatDialog
  ) { }
  ngOnInit(): void {
    console.log('employee info');
    this.initForm();
    this.cardHeight();
    this.fetchDivisions();
    this.fetchTitles();
    this.fetchGender();
    this.fetchStatus();

    this.route.queryParams.subscribe((params) => {
      this.queryParams = params;

      if (this.queryParams['id'] != undefined) {
        console.log(this.queryParams['id']);
        this.actionLabel = 'Update';
        this.getById(this.queryParams['id']);
        this.isDisabled = true;
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

    const formControlNames = ['firstName', 'lastName', 'middleName'];

    formControlNames.forEach((controlName) => {
      this.employeeForm
        .get(controlName)
        ?.valueChanges.subscribe((value: string) => {
          if (value.length > 0) {
            const newValue = this.capitalService.capitalizeFirstLetter(value);
            this.employeeForm
              .get(controlName)
              ?.setValue(newValue, { emitEvent: false });
          }
        });
    });
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

      return CustomValidators.getErrorMessage(errorKey, controlName);
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
          CustomValidators.noLeadingTrailingSpace(),
          CustomValidators.noLeadingSpace(),
          CustomValidators.noWhiteSpace(),
          CustomValidators.noTrailingSpace(),
          CustomValidators.maxLength(10),
          Validators.pattern('^[A-Z0-9\\s\\-]+$'),
        ],
      ],
      middleName: [
        '',
        [
          CustomValidators.noLeadingTrailingSpace(),
          CustomValidators.noLeadingSpace(),
          CustomValidators.noWhiteSpace(),
          CustomValidators.noTrailingSpace(),
          CustomValidators.maxLength(50),
          Validators.pattern('^[A-Za-z]*$'),
          //Validators.pattern('^[A-Za-z\\d][A-Za-z\\d _.-]*[A-Za-z\\d]$|^$'),
        ],
      ],
      title: ['', Validators.required],
      firstName: [
        '',
        [
          Validators.required,
          CustomValidators.noLeadingTrailingSpace(),
          CustomValidators.noLeadingSpace(),
          CustomValidators.noWhiteSpace(),
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
          CustomValidators.noLeadingTrailingSpace(),
          CustomValidators.noLeadingSpace(),
          CustomValidators.noWhiteSpace(),
          CustomValidators.noTrailingSpace(),
          CustomValidators.maxLength(50),
          Validators.pattern('^[A-Za-z]*$'),
          //Validators.pattern('^[A-Za-z\\d][A-Za-z\\d _.-]*[A-Za-z\\d]$|^$'),
        ],
      ],
      dateOfBirth: ['', [Validators.required, this.calculateAge()]], // [{ value: '', disabled: this.isAgeDisabled }],
      gender: ['', Validators.required],
      dateOfJoining: ['', Validators.required],
      age: ['', Validators.required],
      status: ['', Validators.required],
      division: this.formBuilder.group({
        id: ['', Validators.required],
      }),
      orgCode: this.orgCode,
      mobile: [
        '',
        [
          Validators.required,
          CustomValidators.noLeadingTrailingSpace(),
          CustomValidators.noLeadingSpace(),
          CustomValidators.noWhiteSpace(),
          CustomValidators.noTrailingSpace(),
          CustomValidators.maxLength(15),
          Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),
          //  Validators.pattern('^[0-9]*$'),
          //Validators.pattern('^d{10}$'),
        ],
      ],
      phone: [
        '',
        [
          CustomValidators.noLeadingTrailingSpace(),
          CustomValidators.noLeadingSpace(),
          CustomValidators.noWhiteSpace(),
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
          CustomValidators.noLeadingTrailingSpace(),
          CustomValidators.noLeadingSpace(),
          CustomValidators.noWhiteSpace(),
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
    // this.photo = 'xxxx';
    this.photoUpdated.emit(this.photo);
  }

  openFileInput(fileInput: any) {
    fileInput.click();
    this.showAddPhotoOverlay = false;
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.cardHeight();
  }

  cardHeight() {
    this.cardHeights = window.innerHeight;

    this.cardDivHeight = this.cardHeights - 80;
  }

  handleDialog() {
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      width: '450px',
      panelClass: 'custom-dialog',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('User clicked Yes');
        this.removePhoto();
      } else {
        console.log('User clicked No');
        // Perform the action you want after user clicks No or cancels the dialog
      }
    });
  }

  removePhoto() {
    //this.avatarImgElement.nativeElement.src = '';
    //this.photo = '';
    //this.photoUpdated.emit(this.photo);
    console.log('received request', this.photo);
    // let photoUpdated1=this.photo;
    if (this.url) {
      this.fileUploadService.removeImage(this.photo).subscribe((res) => {
        console.log('received response', res);
        //this.url = res['message'];
        this.url = 'assets/profile-img.png';
        console.log('Delete image');
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
      const formData = {
        ...this.employeeForm.value,
        confirmationDate: moment(this.employeeForm.value.dateOfBirth)
          .utcOffset(0, true)
          .format('YYYY-MM-DD'),
        resignationDate: moment(this.employeeForm.value.dateOfJoining)
          .utcOffset(0, true)
          .format('YYYY-MM-DD'),
      };

      this.employeeForm.value.profileImage = this.url;
      console.log('employeeForm', this.employeeForm.value);
      if (this.actionLabel === 'Save') {
        this.employeeService.createEmployee(formData).subscribe(
          (response: Employees) => {
            this.employeeService.notify('Data Saved Successfully...');
            this.router.navigate(['/main/employee-info'], {
              queryParams: { id: response.id, actionLabel: 'Save' },
            });
            // console.log("errormessage"+this.errorMessage);
            //this.errorMessage=response.message;
          },
          (error: any) => {
            console.log('errormessage' + JSON.stringify(error.error.message));
            if (error.status == 400 || error.status == 404) {
              this.employeeService.warn(error.error.message);
            }
          }
        );
      }
      if (this.actionLabel === 'Update') {
        this.employeeService.updateEmployee(formData).subscribe(
          (response: Employees) => {
            this.employeeService.notify('Update Successfully...');
            this.router.navigate(['/main/employee-info'], {
              queryParams: { id: response.id, actionLabel: 'Update' },
            });
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
  getById(id: string) {
    this.employeeService
      .searchEmployeeById(id)
      .subscribe((response: Employees) => {
        this.isDisabled = true;
        this.employeeForm.patchValue(response);
        this.url = response.profileImage;
        const parts = this.url.split('=');
        this.photo = parts[1];
        //this.photo =this.url;
        if (this.url != undefined) {
          //  const filepath=tst.split('/').pop()[0];
        }
        //   console.log("filename",filename);
      });
  }

  uploadImage(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.fileUploadService.uploadImage(file).subscribe((res) => {
        console.log('received response', res);
        this.url = res['message'];
        this.employeeForm.controls['profileImage'].setValue(res['message']);
        this.photo = res['file'];
        console.log('photo', this.photo);
      });
    }
  }

  calculateAge(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      this.selectedDate = control.value as Date;
      if (this.selectedDate) {
        const today = new Date();
        const birthDate = new Date(this.selectedDate);
        const ageTimeSpan = today.getTime() - birthDate.getTime();
        this.age = Math.floor(ageTimeSpan / (1000 * 60 * 60 * 24 * 365.25));
        if (this.age <= 18) {
          this.employeeForm?.get('age')?.setValue('');
          return { ageLessThan18: true };
        }
        this.employeeForm?.get('age')?.setValue(this.age);
        this.isAgeDisabled = true;
        console.log(this.isAgeDisabled);
      }
      return null;
    };
  }
}
