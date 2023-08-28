import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Organization } from '../../../models/organization.model';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OrganizationService } from '../../../services/organization.service';
import { leadingSpaceValidator } from '../Validations/leadingSpace.validator';
import { trailingSpaceValidator } from '../Validations/trailingSpace.validator';
import { idMaxLength } from '../Validations/idMaxLength.validator';
import { nameMaxLength } from '../Validations/nameMaxLength.validator';
import { whitespaceValidator } from '../Validations/whiteSpace.validator';
import { descMaxLength } from '../Validations/descMaxLength.validator';
import { blankValidator } from '../Validations/blankData.validator';

@Component({
  selector: 'app-organization-form',
  templateUrl: './organization-form.component.html',
  styleUrls: ['./organization-form.component.scss'],
})
export class OrganizationFormComponent {
  organizationForm!: FormGroup;
  organization!: Organization;
  submitted: boolean = false;
  queryParams?: Params;
  actionLabel: string = 'Save';
  isDisabled: boolean = false;
  errorMessage: string = '';
  params: HttpParams = new HttpParams();

  constructor(
    private _mdr: MatDialogRef<OrganizationFormComponent>,
    @Inject(MAT_DIALOG_DATA) data: string,
    private formBuilder: FormBuilder,
    private organizationService: OrganizationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.collectQueryParams();
    this.initForm();
    this.organizationForm
      .get('organizationCode')
      ?.valueChanges.subscribe((value: string) => {
        this.organizationForm
          .get('organizationCode')
          ?.setValue(value.toUpperCase(), { emitEvent: false });
      });
  }

  collectQueryParams() {
    this.route.queryParams.subscribe((params) => {
      this.queryParams = params;

      if (this.queryParams['orgCode'] != undefined) {
        this.actionLabel = 'Update';
        this.getByCode(this.queryParams['orgCode']);
        this.isDisabled = true;
      } else {
        this.actionLabel = 'Save';
      }
    });
  }

  initForm() {
    this.organizationForm = this.formBuilder.group({
      id: [''],
      organizationCode: [
        { value: '', disabled: this.isDisabled },
        [
          Validators.required,
          leadingSpaceValidator,
          trailingSpaceValidator,
          idMaxLength,
          Validators.pattern('^[a-zA-Z0-9\\s\\-_]+$'),
          whitespaceValidator,
        ],
      ],

      organizationName: [
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

      organizationDesc: [
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
      createdBy: ['Admin'],
      updatedBy: ['Admin'],
    });
  }

  onSumbit() {
    if (this.organizationForm.valid) {
      this.organizationForm.get('organizationCode')?.enable();
      const formData = this.organizationForm.value;
      formData.updatedBy = 'Admin';

      if (this.actionLabel === 'Save') {
        this.organizationService.createOrganization(formData).subscribe(
          (response: Array<Organization>) => {
            this.organizationService.notify('Organization added successfully');
            this.Close(true);
          },
          (error: any) => {
            if (error.status == 400) {
              this.errorMessage = error.error.message;
              this.organizationService.warn(this.errorMessage);
            }
            console.error('POST Request failed', error);
          }
        );
      }
      if (this.actionLabel === 'Update') {
        this.organizationService.updateOrganization(formData).subscribe(
          (response: Array<Organization>) => {
            this.organizationService.notify(
              'Organization updated successfully'
            );
            this.Close(true);
          },
          (error: any) => {
            if (error.status == 400 || error.status == 404) {
              this.organizationService.warn('Credentials already present');
            }
            console.error('PUT Request failed', error);
          }
        );
      }
    }
  }

  getByCode(orgCoded: string) {
    this.organizationService
      .searchOrganizationByCode(orgCoded)
      .subscribe((response: Organization) => {
        this.organizationForm.patchValue(response);
        this.organization = response;
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
