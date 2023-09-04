import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserRole } from '../../../models/user-role.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { UserRoleService } from '../../../services/user-role.service';
import { leadingSpaceValidator } from '../Validations/leadingSpace.validator';
import { trailingSpaceValidator } from '../Validations/trailingSpace.validator';
import { blankValidator } from '../Validations/blankData.validator';
import { whitespaceValidator } from '../Validations/whiteSpace.validator';
import { nameMaxLength } from '../Validations/nameMaxLength.validator';
import { descMaxLength } from '../Validations/descMaxLength.validator';

@Component({
  selector: 'app-user-role-form',
  templateUrl: './user-role-form.component.html',
  styleUrls: ['./user-role-form.component.scss'],
})
export class UserRoleFormComponent {
  roleForm!: FormGroup;
  role!: UserRole;
  submitted: boolean = false;
  queryParams?: Params;
  actionLabel: string = 'Save';
  isDisabled: boolean = false;

  constructor(
    private _mdr: MatDialogRef<UserRoleFormComponent>,
    private formBuilder: FormBuilder,
    private userRoleService: UserRoleService,
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
    this.router.navigate(['/user/user-table']);
  }

  initForm() {
    this.roleForm = this.formBuilder.group({
      id: [''],
      name: [
        { value: '', disabled: this.isDisabled },
        [
          Validators.required,
          leadingSpaceValidator,
          trailingSpaceValidator,
          blankValidator,
          whitespaceValidator,
          nameMaxLength,
          Validators.pattern('^[a-zA-Z\\s\\-_]+$'),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          leadingSpaceValidator,
          trailingSpaceValidator,
          blankValidator,
          descMaxLength,
        ],
      ],
    });
  }

  get idControl() {
    return this.roleForm.get('id');
  }
  get nameControl() {
    return this.roleForm.get('name');
  }
  get descriptionControl() {
    return this.roleForm.get('description');
  }
  get containerIdControl() {
    return this.roleForm.get('containerId');
  }

  onSubmit() {
    if (this.roleForm.valid) {
      this.roleForm.get('name')?.enable();
      const formData = this.roleForm.value;

      debugger;
      if (this.actionLabel === 'Save') {
        this.userRoleService.createRole(formData).subscribe(
          (response: UserRole) => {
            console.log('POST-ROLE Request successful', response);
            this.router.navigate(['/user/user-role-table']);
            this.userRoleService.notify('Role added successfully');
            this.Close(true);
          },
          (error: any) => {
            if (error.status == 404) {
              this.userRoleService.warn('Role already present');
            }
            console.error('POST Request failed', error);
          }
        );
      }
      if (this.actionLabel === 'Update') {
        this.userRoleService.updateRole(formData).subscribe(
          (response: UserRole) => {
            console.log('PUT-ROLE Request successful', response);
            this.userRoleService.notify('Role updated successfully');
            this.router.navigate(['/user/user-role-table']);
            this.Close(true);
          },
          (error: any) => {
            if (error.status == 404) {
              this.userRoleService.warn('Role already present');
            }
            console.error('PUT Request failed', error);
          }
        );
      }
    }
  }

  getById(id: string) {
    this.userRoleService.searchRoleById(id).subscribe((response: UserRole) => {
      console.log('GET-SEARCH BY ID Request successful', response);
      this.roleForm.patchValue(response);
      this.role = response;
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
