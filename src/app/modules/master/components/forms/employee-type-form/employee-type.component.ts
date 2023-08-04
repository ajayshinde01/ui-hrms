import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EmployeeTypeService } from '../../../services/employee-type.service';
import { Observable } from 'rxjs';
import { Employee } from '../../../models/employee.model';
import { PopupContentComponent } from '../../helper/popup/popup.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { leadingSpaceValidator } from '../validations/leading-space.validator';
import { trailingSpaceValidator } from '../validations/trailing-space.validator';
import { whitespaceValidator } from '../validations/white-space.validator';
@Component({
  selector: 'app-employee-type',
  templateUrl: './employee-type.component.html',
  styleUrls: ['./employee-type.component.scss']
})
export class EmployeeTypeComponent {
  employeeTypeForm!: FormGroup;
  employee: Employee;
  submitted: boolean = false;
  queryParams?: Params;
  actionLabel: string = 'Save';
  constructor(
    public employeeTypeService: EmployeeTypeService, private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.initForm();

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

  initForm() {
    this.employeeTypeForm = this.formBuilder.group({
      id: [''],

      employeeTypeId: [

        '',[
        Validators.required,
        leadingSpaceValidator,
        trailingSpaceValidator,
        whitespaceValidator,
      Validators.pattern('^(?!.*s)[A-Za-z]{1,50}$')]

      ],

    type: [

        '',[
        Validators.required,
        leadingSpaceValidator,
        trailingSpaceValidator,
        whitespaceValidator,
        Validators.pattern('^[A-Za-z _ \-]{1,50}$')]

      ],

      orgCode: [

        '',[
        Validators.required,
        leadingSpaceValidator,
        trailingSpaceValidator,
        whitespaceValidator,
        Validators.pattern('^[a-zA-Z-_]{1,10}$')]

      ],

      createdBy: ['Admin'],
      updatedBy: ['Admin'],
       createdAt: [null],
       updatedAt: [null]
    });


  }



  onSubmit() {
    if (this.employeeTypeForm.valid) {
      const formData = this.employeeTypeForm.value;

      if (this.actionLabel === 'Save') {
        this.employeeTypeService.createEmployee(formData).subscribe(
          (response: Employee) => {
            console.log('POST-EmployeeType Request successful', response);
            this.employeeTypeService.notify(" Record Save Successfully...");
            this.router.navigate(['/master/employee-table']);
          },
          (error: any) => {
            if (error.status == 400) {
              this.employeeTypeService.warn('Credentials already present');
            }
          }
        );
      }
      if (this.actionLabel === 'Update') {
        this.employeeTypeService.updateEmployee(formData).subscribe(
          (response: Employee) => {
            this.employeeTypeService.notify("Record Update Successfully...");
            this.router.navigate(['/master/employee-table']);
          },
          (error: any) => {
            if (error.status == 400) {
              this.employeeTypeService.warn('Credentials already present');
            }
            console.error('PUT Request failed', error);
          }
        );
      }
    }
  }

  getById(id: number) {
    this.employeeTypeService.searchEmployeeById(id).subscribe((response: Employee) => {
      this.employeeTypeForm.patchValue(response);
      this.employee = response;
    });
  }

}








