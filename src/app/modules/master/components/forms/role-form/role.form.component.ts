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
  constructor(
    private _mdr: MatDialogRef<RoleFormComponent>,
    @Inject(MAT_DIALOG_DATA) data: string,
    private formBuilder: FormBuilder,
    private roleService: RoleService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnChnages() {}
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
      const formData = this.roleForm.value;
      formData.updatedBy = 'Admin';

      if (this.actionLabel === 'Save') {
        this.roleService.createRole(formData).subscribe(
          (response: Array<Role>) => {
            console.log('POST-ROLE Request successful', response);
            console.log('inside submit and ready to close dialogue');
            this.CloseDialog();
            this.router.navigate(['/master/role']);
            this.roleService.notify('Role Added successfully..!');
          },
          (error: any) => {
            if (error.status == 400 || error.status == 404) {
              this.roleService.warn('Credentials already present');
            }
            console.error('POST Request failed', error);
          }
        );
      }
      if (this.actionLabel === 'Update') {
        this.roleService.updateRole(formData).subscribe(
          (response: Array<Role>) => {
            console.log('PUT-ROLE Request successful', response);
            this.CloseDialog();

            this.roleService.notify('Role Updated successfully..!');
            this.router.navigate(['/master/role']);
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
      this.roleForm.patchValue(response);
      this.role = response;
    });
  }

  CloseDialog() {
    this._mdr.close(false);
    this.router.navigate(['/master/role']);
  }

  resetForm() {
    this.collectQueryParams();
    this.initForm();
  }
}
