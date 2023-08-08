import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { EmployeeTypeService } from '../../../services/employee-type.service';
import { Observable } from 'rxjs';
import { Employee } from '../../../models/employee.model';
import { PopupComponent } from '../../helper/popup/popup.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { leadingSpaceValidator } from '../Validations/leadingSpace.validator';
import { trailingSpaceValidator } from '../Validations/trailingSpace.validator';
import { whitespaceValidator } from '../Validations/whiteSpace.validator';
import { idMaxLength } from '../Validations/idMaxLength.validator';
import { nameMaxLength } from '../Validations/nameMaxLength.validator';

@Component({
  selector: 'app-employee-type',
  templateUrl: './employee-type.component.html',
  styleUrls: ['./employee-type.component.scss'],
})
export class EmployeeTypeComponent {
  employeeTypeForm!: FormGroup;
  employee: Employee;
  submitted: boolean = false;
  queryParams?: Params;
  actionLabel: string = 'Save';
  constructor(
    public employeeTypeService: EmployeeTypeService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {}
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
  goBack() {
    this.router.navigate(['/master/employee-table']);
  }
  initForm() {
    this.employeeTypeForm = this.formBuilder.group({
      id: [''],

      employeeTypeId: [
        '',
        [
          Validators.required,
          leadingSpaceValidator,
          trailingSpaceValidator,
          idMaxLength,
          Validators.pattern('^[A-Za-z\\d][A-Za-z\\d-]*[A-Za-z\\d]$'),
        ],
      ],

      type: [
        '',
        [
          Validators.required,
          leadingSpaceValidator,
          trailingSpaceValidator,
          Validators.pattern('^[A-Za-z\\d][A-Za-z\\d _.-]*[A-Za-z\\d]$|^$'),
        ],
      ],

      orgCode: [
        '',
        [
          Validators.required,
          leadingSpaceValidator,
          trailingSpaceValidator,
          whitespaceValidator,
          Validators.pattern('^[A-Za-z\\d][A-Za-z\\d-_]*[A-Za-z\\d]$'),
        ],
      ],

      createdBy: ['Admin'],
      updatedBy: ['Admin'],
      createdAt: [null],
      updatedAt: [null],
    });
  }

  onSubmit() {
    if (this.employeeTypeForm.valid) {
      const formData = this.employeeTypeForm.value;

      if (this.actionLabel === 'Save') {
        this.employeeTypeService.createEmployee(formData).subscribe(
          (response: Employee) => {
            console.log('POST-EmployeeType Request successful', response);
            this.employeeTypeService.notify(
              ' Employee Type Added Successfully...'
            );
            this.router.navigate(['/master/employee-table']);
          },
          (error: any) => {
            if (error.status == 400 || error.status == 404) {
              this.employeeTypeService.warn('Credentials already present');
            }
          }
        );
      }
      if (this.actionLabel === 'Update') {
        this.employeeTypeService.updateEmployee(formData).subscribe(
          (response: Employee) => {
            this.employeeTypeService.notify('Record Update Successfully...');
            this.router.navigate(['/master/employee-table']);
          },
          (error: any) => {
            if (error.status == 400 || error.status == 404) {
              this.employeeTypeService.warn('Credentials already present');
            }
            console.error('PUT Request failed', error);
          }
        );
      }
    }
  }

  getById(id: number) {
    this.employeeTypeService
      .searchEmployeeById(id)
      .subscribe((response: Employee) => {
        this.employeeTypeForm.patchValue(response);
        this.employee = response;
      });
  }
}
