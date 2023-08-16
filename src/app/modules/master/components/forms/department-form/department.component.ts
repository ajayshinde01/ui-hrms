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
        ],
      ],
      departmentName: [
        '',
        [
          Validators.required,
          leadingSpaceValidator,
          trailingSpaceValidator,
          nameMaxLength,
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
          Validators.pattern('^[a-zA-Z0-9\\s_\\-!@&()_{}[\\]|;:",.?]+$'),
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
      const formData = this.departmentForm.value;
      formData.updatedBy = 'Admin';

      if (this.actionLabel === 'Save') {
        this.departmentService.createDepartment(formData).subscribe(
          (response: Department) => {
            this.CloseDialog();
            this.departmentService.notify('Department added Successfully...');
            this.router.navigate(['/master/department-table']);
          },
          (error: any) => {
            if (error.status == 400 || error.status == 404) {
              this.departmentService.warn('Department Id already present');
            }
          }
        );
      }
      if (this.actionLabel === 'Update') {
        formData.updatedBy = 'Admin';
        this.departmentService.updateDepartment(formData).subscribe(
          (response: Department) => {
            this.CloseDialog();

            this.departmentService.notify('Update Successfully...');
            this.router.navigate(['/master/department-table']);
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

  CloseDialog() {
    this._mdr.close(false);
    this.router.navigate(['/master/department-table']);
  }

  resetForm() {
    this.collectQueryParams();
    this.initForm();
  }
}
