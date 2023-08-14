import { Component, ViewEncapsulation, OnInit, Inject } from '@angular/core';
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
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
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
  isDisabled: boolean = false;

  constructor(
    private _mdr: MatDialogRef<EmployeeTypeComponent>,
    @Inject(MAT_DIALOG_DATA) data: string,
    public employeeTypeService: EmployeeTypeService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.collectQueryParams();
    this.initForm();
  }

  collectQueryParams() {
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
  }

  get employeeTypeIdControl() {
    return this.employeeTypeForm.get('employeeTypeId');
  }

  goBack() {
    this.router.navigate(['/master/employee-table']);
  }
  initForm() {
    this.employeeTypeForm = this.formBuilder.group({
      id: [''],

      employeeTypeId: [
        { value: '', disabled: this.isDisabled },
        [
          Validators.required,
          leadingSpaceValidator,
          trailingSpaceValidator,
          idMaxLength,
          Validators.pattern('^[a-zA-Z0-9\\s\\-]+$'),
          whitespaceValidator,
        ],
      ],

      type: [
        '',
        [
          Validators.required,
          leadingSpaceValidator,
          trailingSpaceValidator,
          nameMaxLength,
          Validators.pattern('^[a-zA-Z0-9\\s\\-._]+$'),
        ],
      ],

      orgCode: [
        '',
        [
          Validators.required,
          leadingSpaceValidator,
          trailingSpaceValidator,
          whitespaceValidator,
          Validators.pattern('^[a-zA-Z0-9\\s\\-_]+$'),
          whitespaceValidator,
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
      this.employeeTypeForm.get('employeeTypeId')?.enable();
      const formData = this.employeeTypeForm.value;
      formData.updatedBy = 'Admin';

      if (this.actionLabel === 'Save') {
        this.employeeTypeService.createEmployee(formData).subscribe(
          (response: Employee) => {
            console.log('POST-EmployeeType Request successful', response);
            this.CloseDialog();
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
        formData.updatedBy = 'Admin';
        this.employeeTypeService.updateEmployee(formData).subscribe(
          (response: Employee) => {
            this.CloseDialog();
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

  CloseDialog() {
    this._mdr.close(false);
    this.router.navigate(['/master/employee-table']);
  }

  resetForm() {
    this.collectQueryParams();
    this.initForm();
  }
}
