import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonMaster } from 'src/app/modules/main/models/common-master.model';
import { Division } from 'src/app/modules/main/models/division.model';
import { Employee } from 'src/app/modules/main/models/employee.model';
import { FileResponse } from 'src/app/modules/main/models/fileResponse.model';
import { DivisionService } from 'src/app/modules/main/services/division.service';
import { EmployeeService } from 'src/app/modules/main/services/employee.service';
import { FileUploadService } from 'src/app/modules/main/services/file-upload.service';

@Component({
  selector: 'app-employee-personal-info-form',
  templateUrl: './employee-personal-info-form.component.html',
  styleUrls: ['./employee-personal-info-form.component.scss'],
})
export class EmployeePersonalInfoFormComponent implements OnInit {
  employeeForm!: FormGroup;
  employee: Employee;
  submitted: boolean = false;
  queryParams?: Params;
  actionLabel: string = 'Save';
  isDisabled: boolean = false;
  divisions: Division[] = [];
  titles: CommonMaster[] = [];
  isAgeDisabled: boolean = false;
  age: number;
  selectedDate: Date;
  url: String = '../../../assets/profile-img.jpg';
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
    this.initForm();
    this.fetchDivisions();
    this.fetchTitles();
    this.route.queryParams.subscribe((params) => {
      this.queryParams = params;
      if (this.queryParams['id'] != undefined) {
        this.actionLabel = 'Update';
        this.getById(this.queryParams['id']);
      } else {
        this.actionLabel = 'Save';
      }
    });
  }
  fetchTitles() {
    this.employeeService.getTitle().subscribe((Response: CommonMaster[]) => {
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

  goBack() {
    this.router.navigate(['/main/employee-table']);
  }
  initForm() {
    this.employeeForm = this.formBuilder.group({
      id: [''],
      employeeCode: [{ value: '', disabled: this.isDisabled }],
      middleName: [''],
      title: [''],
      firstName: [''],
      lastName: [''],
      dateOfBirth: [{ value: '', disabled: this.isAgeDisabled }],
      gender: [''],
      dateOfJoining: [''],
      age: [''],
      status: [''],
      division: this.formBuilder.group({
        id: [''],
      }),
      orgCode: ['AVI01'],
      mobile: [''],
      phone: [''],
      email: [''],
      userId: [''],
      profileImage: [''],
      createdBy: ['Admin'],
      updatedBy: ['Admin'],
      createdAt: [null],
      updatedAt: [null],
    });
  }
  onSubmit() {
    if (this.employeeForm.valid) {
      const formData = this.employeeForm.value;
      if (this.actionLabel === 'Save') {
        this.employeeService.createEmployee(formData).subscribe(
          (response: Employee) => {
            this.employeeService.notify('Save Successfully...');
            this.router.navigate(['/main/employee-table']);
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
          (response: Employee) => {
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
      .subscribe((response: Employee) => {
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
      debugger;
    }
  }
}
