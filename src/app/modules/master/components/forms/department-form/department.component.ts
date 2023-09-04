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
import { Observable } from 'rxjs';
import { Department } from '../../../models/department.model';
import { DepartmentService } from '../../../services/department.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PopupComponent } from '../../helper/popup/popup.component';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { leadingSpaceValidator } from '../Validations/leadingSpace.validator';
import { trailingSpaceValidator } from '../Validations/trailingSpace.validator';
import { whitespaceValidator } from '../Validations/whiteSpace.validator';
import { descMaxLength } from '../Validations/descMaxLength.validator';
import { idMaxLength } from '../Validations/idMaxLength.validator';
import { nameMaxLength } from '../Validations/nameMaxLength.validator';
import { blankValidator } from '../Validations/blankData.validator';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss'],
})
export class DepartmentComponent implements OnInit {
  departmentForm!: FormGroup;
  department: Department;
  submitted: boolean = false;
  queryParams?: Params;
  isDisabled: boolean = false;
  errorMessage: string = '';
  orgCode = sessionStorage.getItem('orgCode');
  actionLabel: string = 'Save';
  constructor(
    private _mdr: MatDialogRef<DepartmentComponent>,
    @Inject(MAT_DIALOG_DATA) data: string,
    public departmentService: DepartmentService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.collectQueryParams();
    this.initForm();
    this.departmentForm
      .get('departmentId')
      ?.valueChanges.subscribe((value: string) => {
        this.departmentForm
          .get('departmentId')
          ?.setValue(value.toUpperCase(), { emitEvent: false });
      });

    this.departmentForm
      .get('orgCode')
      ?.valueChanges.subscribe((value: string) => {
        this.departmentForm
          .get('orgCode')
          ?.setValue(value.toUpperCase(), { emitEvent: false });
      });

    this.departmentForm
      .get('departmentName')
      ?.valueChanges.subscribe((value: string) => {
        if (value.length > 0) {
          const firstLetter = value.charAt(0).toUpperCase();

          const restOfValue = value.slice(1);

          const newValue = firstLetter + restOfValue;

          this.departmentForm
            .get('departmentName')
            ?.setValue(newValue, { emitEvent: false });
        }
      });
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

  goBack() {
    this.router.navigate(['/master/department-table']);
  }
  initForm() {
    this.departmentForm = this.formBuilder.group({
      id: [''],
      departmentId: [
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
      departmentName: [
        '',
        [
          Validators.required,
          leadingSpaceValidator,
          trailingSpaceValidator,
          nameMaxLength,
          blankValidator,
          Validators.pattern('^[a-zA-Z0-9\\s\\-._]+$'),
        ],
      ],
      departmentDescription: [
        '',
        [
          Validators.required,
          leadingSpaceValidator,
          trailingSpaceValidator,
          descMaxLength,
          blankValidator,

          Validators.pattern('^[a-zA-Z0-9\\s_\\-!@&()_{}[\\]|;:",.?]+$'),
        ],
      ],
      orgCode: [
        { value: this.orgCode, disabled: true },
        [
          Validators.required,
          leadingSpaceValidator,
          trailingSpaceValidator,
          whitespaceValidator,
          Validators.pattern('^[a-zA-Z0-9\\s\\-_]+$'),
        ],
      ],
      createdBy: ['Admin'],
      updatedBy: ['Admin'],
      createdAt: [null],
      updatedAt: [null],
    });
  }

  onSubmit() {
    if (this.departmentForm.valid) {
      this.departmentForm.get('departmentId')?.enable();
      this.departmentForm.get('orgCode')?.enable();
      const formData = this.departmentForm.value;
      formData.updatedBy = 'Admin';

      if (this.actionLabel === 'Save') {
        this.departmentService.createDepartment(formData).subscribe(
          (response: Department) => {
            this.departmentService.notify('Department added successfully');

            this.Close(true);
          },
          (error: any) => {
            if (error.status == 400 || error.status == 404) {
              this.errorMessage = error.error.message;
              this.departmentService.warn(this.errorMessage);
            }
          }
        );
      }
      if (this.actionLabel === 'Update') {
        formData.updatedBy = 'Admin';
        this.departmentService.updateDepartment(formData).subscribe(
          (response: Department) => {
            this.departmentService.notify('Department updated successfully');

            this.Close(true);
          },
          (error: any) => {
            if (error.status == 400 || error.status == 404) {
              this.departmentService.warn('Credentials already present');
            }
          }
        );
      }
    }
  }
  getById(id: string) {
    this.departmentService
      .searchDepartmentById(id)
      .subscribe((response: Department) => {
        this.departmentForm.patchValue(response);
        this.department = response;
      });
  }

  Close(isUpdate: boolean) {
    this._mdr.close(isUpdate);
  }

  resetForm() {
    this.collectQueryParams();
    this.initForm();
  }
}
