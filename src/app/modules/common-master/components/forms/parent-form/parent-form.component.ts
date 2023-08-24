import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Parent } from '../../../models/role.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ParentService } from '../../../services/parent.service';

@Component({
  selector: 'app-parent-form',
  templateUrl: './parent-form.component.html',
  styleUrls: ['./parent-form.component.scss'],
})
export class ParentFormComponent {
  // parentForm!: FormGroup;
  // parent!: Parent;
  // submitted: boolean = false;
  // queryParams?: Params;
  // actionLabel: string = 'Save';
  // allRoles: UserRole[] = [];
  // isDisabled: boolean = false;
  // constructor(
  //   //private _mdr: MatDialogRef<UserFormComponent>,
  //   private formBuilder: FormBuilder,
  //   private parentService: ParentService,
  //   private router: Router,
  //   private route: ActivatedRoute
  // ) {}
  // ngOnInit(): void {
  //   this.collectQueryParams();
  //   this.initForm();
  //   this.getAllRoles();
  // }
  // collectQueryParams() {
  //   this.route.queryParams.subscribe((params) => {
  //     this.queryParams = params;
  //     if (this.queryParams['id'] != undefined) {
  //       console.log(this.queryParams['id']);
  //       this.actionLabel = 'Update';
  //       this.getById(this.queryParams['id']);
  //       this.isDisabled = true;
  //     } else {
  //       this.actionLabel = 'Save';
  //     }
  //   });
  // }
  // goBack() {
  //   this.router.navigate(['/common-master/parent']);
  // }
  // initForm() {
  //   this.parentForm = this.formBuilder.group({
  //     id: [''],
  //     username: [''],
  //     firstName: ['', [Validators.required]],
  //     lastName: ['', [Validators.required]],
  //     email: ['', [Validators.required]],
  //     password: ['', [Validators.required]],
  //     roles: [[]],
  //     enabled: ['true'],
  //   });
  // }
  // get idControl() {
  //   return this.userForm.get('id');
  // }
  // get usernameControl() {
  //   return this.userForm.get('username');
  // }
  // get firstNameControl() {
  //   return this.userForm.get('firstName');
  // }
  // get lastNameControl() {
  //   return this.userForm.get('lastName');
  // }
  // get emailControl() {
  //   return this.userForm.get('email');
  // }
  // get passwordControl() {
  //   return this.userForm.get('password');
  // }
  // get rolesControl() {
  //   return this.userForm.get('roles');
  // }
  // get enableControl() {
  //   return this.userForm.get('enabled');
  // }
  // onSubmit() {
  //   if (this.userForm.valid) {
  //     const formData = this.userForm.value;
  //     if (this.actionLabel === 'Save') {
  //       this.userService.createUser(formData).subscribe(
  //         (response: User) => {
  //           console.log('POST-USER Request successful', response);
  //           this.router.navigate(['/user/user-table']);
  //           this.userService.notify('User Added successfully..!');
  //           this.Close(true);
  //         },
  //         (error: any) => {
  //           if (error.status == 404) {
  //             this.userService.warn('Credentials already present');
  //           }
  //           console.error('POST Request failed', error);
  //         }
  //       );
  //     }
  //     if (this.actionLabel === 'Update') {
  //       this.userService.updateUser(formData).subscribe(
  //         (response: User) => {
  //           console.log('PUT-USER Request successful', response);
  //           this.userService.notify('User Updated successfully..!');
  //           this.router.navigate(['/user/user-table']);
  //           this.Close(true);
  //         },
  //         (error: any) => {
  //           if (error.status == 400) {
  //             this.userService.warn('Credentials already present');
  //           }
  //           console.error('PUT Request failed', error);
  //         }
  //       );
  //     }
  //   }
  // }
  // getById(id: string) {
  //   this.userService.searchUserById(id).subscribe((response: User) => {
  //     console.log('GET-SEARCH BY ID Request successful', response);
  //     this.userForm.patchValue(response);
  //     this.user = response;
  //   });
  // }
  // getAllRoles() {
  //   this.userRoleService.getRoles().subscribe(
  //     (response: Array<UserRole>) => {
  //       this.allRoles = response;
  //     },
  //     (error: any) => {
  //       console.error('Error fetching roles', error);
  //     }
  //   );
  // }
  // Close(isUpdate: boolean) {
  //   this._mdr.close(isUpdate);
  // }
  // resetForm() {
  //   this.collectQueryParams();
  //   this.initForm();
  // }
}
