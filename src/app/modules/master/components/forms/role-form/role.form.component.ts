import { Component } from '@angular/core';
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
    private formBuilder: FormBuilder,
    private roleService: RoleService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnChnages() {}
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.queryParams = params;

      if (this.queryParams['id'] != undefined) {
        this.actionLabel = 'Update';
        this.getById(this.queryParams['id']);
        this.isDisabled = true;
      } else {
        this.actionLabel = 'Save';
        this.isDisabled = false;
      }
    });
    this.initForm();
  }

  goBack() {
    this.router.navigate(['/master/role']);
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
      const formData = this.roleForm.value;

      if (this.actionLabel === 'Save') {
        this.roleService.createRole(formData).subscribe(
          (response: Array<Role>) => {
            console.log('POST-ROLE Request successful', response);
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
}
