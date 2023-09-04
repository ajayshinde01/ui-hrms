import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RoleService } from '../../../services/role.service';
import { Role } from '../../../models/role.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { leadingSpaceValidator } from '../Validations/leadingSpace.validator';
import { trailingSpaceValidator } from '../Validations/trailingSpace.validator';
import { whitespaceValidator } from '../Validations/whiteSpace.validator';
import { idMaxLength } from '../Validations/idMaxLength.validator';
import { nameMaxLength } from '../Validations/nameMaxLength.validator';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpParams } from '@angular/common/http';
import { blankValidator } from '../Validations/blankData.validator';

@Component({
  selector: 'role-form',
  templateUrl: './role.form.component.html',
  styleUrls: ['./role.form.component.scss'],
})
export class RoleFormComponent {
  roleForm!: FormGroup;
  role!: Role;
  submitted: boolean = false;
  queryParams?: Params;
  actionLabel: string = 'Save';
  isDisabled: boolean = false;
  errorMessage: string = '';
  orgCode = sessionStorage.getItem('orgCode');
  params: HttpParams = new HttpParams();
  roleMetaData: { content: Array<Role>; totalElements: number } = {
    content: [],
    totalElements: 0,
  };
  id: string = '';

  constructor(
    private _mdr: MatDialogRef<RoleFormComponent>,
    @Inject(MAT_DIALOG_DATA) data: string,
    private formBuilder: FormBuilder,
    private roleService: RoleService,
    private route: ActivatedRoute
  ) {}

  ngOnChnages() {
    //this.searchFunction(this.params);
  }
  ngOnInit(): void {
    this.collectQueryParams();
    this.initForm();
    this.roleForm.get('roleId')?.valueChanges.subscribe((value: string) => {
      this.roleForm
        .get('roleId')
        ?.setValue(value.toUpperCase(), { emitEvent: false });
    });

    this.roleForm.get('orgCode')?.valueChanges.subscribe((value: string) => {
      this.roleForm
        .get('orgCode')
        ?.setValue(value.toUpperCase(), { emitEvent: false });
    });

    this.roleForm.get('roleName')?.valueChanges.subscribe((value: string) => {
      if (value.length > 0) {
        const firstLetter = value.charAt(0).toUpperCase();

        const restOfValue = value.slice(1);

        const newValue = firstLetter + restOfValue;

        this.roleForm.get('roleName')?.setValue(newValue, { emitEvent: false });
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

  initForm() {
    this.roleForm = this.formBuilder.group({
      id: [''],
      roleId: [
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

      roleName: [
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
      orgCode: [
        { value: this.orgCode, disabled: true },
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
    });
  }

  get roleIdControl() {
    return this.roleForm.get('roleId');
  }
  get roleNameControl() {
    return this.roleForm.get('roleName');
  }
  get orgControl() {
    return this.roleForm.get('orgCode');
  }
  onSumbit() {
    if (this.roleForm.valid) {
      this.roleForm.get('roleId')?.enable();
      this.roleForm.get('orgCode')?.enable();
      const formData = this.roleForm.value;
      formData.updatedBy = 'Admin';

      if (this.actionLabel === 'Save') {
        this.roleService.createRole(formData).subscribe(
          (response: Array<Role>) => {
            this.roleService.notify('Role added successfully');
            this.Close(true);
          },
          (error: any) => {
            if (error.status == 400) {
              this.errorMessage = error.error.message;
              this.roleService.warn(this.errorMessage);
            }
            console.error('POST Request failed', error);
          }
        );
      }
      if (this.actionLabel === 'Update') {
        this.roleService.updateRole(formData).subscribe(
          (response: Array<Role>) => {
            console.log('PUT-ROLE Request successful', response);
            this.roleService.notify('Role updated successfully');
            this.Close(true);
          },
          (error: any) => {
            if (error.status == 400 || error.status == 404) {
              this.roleService.warn('Credentials already present');
            }
            console.error('PUT Request failed', error);
          }
        );
      }
    }
  }

  getById(id: string) {
    this.roleService.searchRoleById(id).subscribe((response: Role) => {
      console.log('GET-SEARCH BY ID Request successful', response);
      this.id = response.roleId;
      this.roleForm.patchValue(response);
      this.role = response;
    });
  }

  Close(isUpdate: boolean) {
    this._mdr.close(isUpdate);
  }
  resetForm() {
    this.collectQueryParams();
    // if (this.actionLabel == 'Update') {
    //   this.roleForm.patchValue(this.role);
    // } else this.roleForm.patchValue({ roleId: null, roleName: null });
    this.initForm();
  }
}
