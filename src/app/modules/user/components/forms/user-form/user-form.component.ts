import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../models/user.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { UserRole } from '../../../models/user-role.model';
import { UserRoleService } from '../../../services/user-role.service';
import { MatDialogRef } from '@angular/material/dialog';
import { leadingSpaceValidator } from '../Validations/leadingSpace.validator';
import { trailingSpaceValidator } from '../Validations/trailingSpace.validator';
import { nameMaxLength } from '../Validations/nameMaxLength.validator';
import { blankValidator } from '../Validations/blankData.validator';
import { whitespaceValidator } from '../Validations/whiteSpace.validator';
import { emailMaxLength } from '../Validations/emailMaxLength.validator';
import { CommonMaster } from '../../../models/common-master.model';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent {
  userForm!: FormGroup;
  user!: User;
  submitted: boolean = false;
  queryParams?: Params;
  actionLabel: string = 'Save';
  allRoles: UserRole[] = [];
  isDisabled: boolean = false;
  allUserStatus: CommonMaster[] = [];

  constructor(
    private _mdr: MatDialogRef<UserFormComponent>,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private userRoleService: UserRoleService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.collectQueryParams();
    this.initForm();
    this.getAllRoles();
    this.getAllUserStatus();
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
    this.userForm = this.formBuilder.group(
      {
        id: [''],
        firstName: [
          '',
          [
            Validators.required,
            leadingSpaceValidator,
            trailingSpaceValidator,
            blankValidator,
            whitespaceValidator,
            nameMaxLength,
            Validators.pattern('^[a-zA-Z\\s]+$'),
          ],
        ],
        lastName: [
          '',
          [
            Validators.required,
            leadingSpaceValidator,
            trailingSpaceValidator,
            blankValidator,
            whitespaceValidator,
            nameMaxLength,
            Validators.pattern('^[a-zA-Z\\s]+$'),
          ],
        ],
        email: [
          '',
          [
            Validators.required,
            leadingSpaceValidator,
            trailingSpaceValidator,
            blankValidator,
            whitespaceValidator,
            emailMaxLength,
            Validators.pattern(
              '^(?!.*[._-]{2})[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$'
            ),
          ],
        ],
        password: ['', this.getPasswordValidators()],
        confirmPassword: ['', Validators.required],
        roles: [[]],
        enabled: [''],
      },
      {
        validator: this.checkIfMatchingPasswords(
          'password',
          'confirmPassword',
          this.actionLabel
        ),
      }
    );
  }

  get idControl() {
    return this.userForm.get('id');
  }
  get usernameControl() {
    return this.userForm.get('username');
  }
  get firstNameControl() {
    return this.userForm.get('firstName');
  }
  get lastNameControl() {
    return this.userForm.get('lastName');
  }
  get emailControl() {
    return this.userForm.get('email');
  }
  get passwordControl() {
    return this.userForm.get('password');
  }
  get confirmPasswordControl() {
    return this.userForm.get('confirmPassword');
  }
  get rolesControl() {
    return this.userForm.get('roles');
  }
  get enableControl() {
    return this.userForm.get('enabled');
  }

  getPasswordValidators() {
    return this.actionLabel === 'Save'
      ? [
          Validators.required,
          leadingSpaceValidator,
          trailingSpaceValidator,
          blankValidator,
          whitespaceValidator,
        ]
      : null;
  }

  checkIfMatchingPasswords(
    password: string,
    confirmPassword: string,
    action: string
  ) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[password],
        passwordConfirmationInput = group.controls[confirmPassword];
      if (
        action === 'Save' &&
        passwordInput.value !== passwordConfirmationInput.value
      ) {
        return passwordConfirmationInput.setErrors({
          passwordMismatch: true,
        });
      } else if (action === 'Save' && passwordInput.value === null) {
        return passwordConfirmationInput.setErrors({ required: true });
      } else if (action === 'Update') {
        return passwordConfirmationInput.setErrors(null);
      }
    };
  }

  getAllUserStatus() {
    this.userService.getUserStatus().subscribe((response) => {
      this.allUserStatus = response;
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      const formData = this.userForm.value;
      console.log(this.queryParams);

      if (this.actionLabel === 'Save') {
        this.userService.createUser(formData).subscribe(
          (response: User) => {
            console.log('POST-USER Request successful', response);
            this.router.navigate(['/user/user-table']);
            this.userService.notify('User Added successfully..!');
            this.Close(true);
          },
          (error: any) => {
            if (error.status == 404) {
              this.userService.warn('Email ID already present');
            }
            console.error('POST Request failed', error);
          }
        );
      }
      if (this.actionLabel === 'Update') {
        this.userService.updateUser(formData).subscribe(
          (response: User) => {
            console.log('PUT-USER Request successful', response);
            this.userService.notify('User Updated successfully..!');
            this.router.navigate(['/user/user-table']);
            this.Close(true);
          },
          (error: any) => {
            if (error.status == 400) {
              this.userService.warn('Email ID already present');
            }
            console.error('PUT Request failed', error);
          }
        );
      }
    }
  }

  getById(id: string) {
    this.userService.searchUserById(id).subscribe((response: User) => {
      console.log('GET-SEARCH BY ID Request successful', response);
      this.userForm.patchValue(response);
      this.user = response;
    });
  }

  getAllRoles() {
    this.userRoleService.getRoles().subscribe(
      (response: Array<UserRole>) => {
        this.allRoles = response;
      },
      (error: any) => {
        console.error('Error fetching roles', error);
      }
    );
  }

  Close(isUpdate: boolean) {
    this._mdr.close(isUpdate);
  }

  resetForm() {
    this.collectQueryParams();
    this.initForm();
  }
}
