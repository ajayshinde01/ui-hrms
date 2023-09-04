import { Component, Inject, OnInit } from '@angular/core';

import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { ActivatedRoute, Params, Router } from '@angular/router';

import { WorkExperienceService } from '../../../services/work-experience.service';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { WorkExperience } from '../../../models/work-experience.model';
import { CustomValidators } from '../../../services/custom-validators.service';
import * as moment from 'moment';
import { FirstLetterCapitalService } from 'src/app/modules/shared/services/first-letter-capital.service';

@Component({
  selector: 'app-work-experience-form',

  templateUrl: './work-experience-form.component.html',

  styleUrls: ['./work-experience-form.component.scss'],
})
export class WorkExperienceFormComponent implements OnInit {
  workExperienceForm!: FormGroup;

  submitted: boolean = false;

  queryParams: Params;

  actionLabel: string = 'Save';

  isDisabled: boolean = false;

  workExperienceId: number;

  employeeId: number;

  constructor(
    private dialogRef: MatDialogRef<WorkExperienceFormComponent>,

    private formBuilder: FormBuilder,

    private workExperienceService: WorkExperienceService,

    private router: Router,

    private route: ActivatedRoute,
    private capitalService: FirstLetterCapitalService,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.collectQueryParams();

    this.initForm();
    const formControlNames = ['companyName', 'designation'];

    formControlNames.forEach((controlName) => {
      this.workExperienceForm
        .get(controlName)
        ?.valueChanges.subscribe((value: string) => {
          if (value.length > 0) {
            const newValue = this.capitalService.capitalizeFirstLetter(value);
            this.workExperienceForm
              .get(controlName)
              ?.setValue(newValue, { emitEvent: false });
          }
        });
    });
  }

  collectQueryParams() {
    this.route.queryParams.subscribe((params) => {
      this.queryParams = params;

      if (
        this.data['workExperienceId'] != undefined &&
        this.data['id'] != undefined
      ) {
        this.actionLabel = 'Update';

        this.workExperienceId = this.data['workExperienceId'];

        this.employeeId = this.queryParams['id'];

        this.getById(this.employeeId, this.workExperienceId);

        this.isDisabled = true;
      } else {
        this.actionLabel = 'Save';

        this.employeeId = this.queryParams['id'];
      }
    });
  }

  goBack() {
    this.router.navigate(['/user/user-table']);
  }

  initForm() {
    this.workExperienceForm = this.formBuilder.group({
      id: [''],

      companyName: [
        '',
        [
          Validators.required,
          CustomValidators.noLeadingSpace(),
          CustomValidators.noTrailingSpace(),
          CustomValidators.maxLengthOfCompany(50),
          CustomValidators.validCompanyFormat(),
        ],
      ],

      designation: [
        '',
        [
          Validators.required,
          CustomValidators.noLeadingSpace(),
          CustomValidators.noTrailingSpace(),
          CustomValidators.designationPeriodMaxLength(100),
          CustomValidators.validDesignationFormat(),
        ],
      ],

      fromDate: ['', [Validators.required, CustomValidators.pastDate()]],

      toDate: [
        '',
        [
          Validators.required,
          CustomValidators.pastDate(),
          this.graterWorkExperince(),
        ],
      ],

      address: [
        '',
        [
          Validators.required,
          CustomValidators.noLeadingSpace(),
          CustomValidators.noTrailingSpace(),
          CustomValidators.maxLengthOfAddress(250),
          CustomValidators.validAddressFormat(),
        ],
      ],

      createdBy: ['Admin'],

      updatedBy: ['Admin'],

      createdAt: [null],

      updatedAt: [null],

      orgCode: ['AVI01'],
    });
  }

  onSubmit() {
    if (this.workExperienceForm.valid) {
      const formData = {
        ...this.workExperienceForm.value,
        fromDate: moment(this.workExperienceForm.value.toDate)
          .utcOffset(0, true)
          .format('YYYY-MM-DD'),
        toDate: moment(this.workExperienceForm.value.toDate)
          .utcOffset(0, true)
          .format('YYYY-MM-DD'),
      };
      if (this.actionLabel === 'Save') {
        this.workExperienceService

          .createWorkExperience(formData, this.employeeId)

          .subscribe(
            (response: WorkExperience) => {
              console.log('POST Request successful', response);

              this.workExperienceService.notify(
                'Work Experience Added Successfully'
              );

              this.closeDialog(true);
            },

            (error: any) => {
              console.error('POST Request failed', error);
            }
          );
      }

      if (this.actionLabel === 'Update') {
        formData.updatedBy = 'Admin';
        this.workExperienceService

          .updateWorkExperience(formData, this.employeeId)

          .subscribe(
            (response: WorkExperience) => {
              console.log('PUT Request successful', response);

              this.workExperienceService.notify(
                'Work Experience Updated Successfully'
              );

              this.closeDialog(true);
            },

            (error: any) => {
              console.error('PUT Request failed', error);
            }
          );
      }
    }
  }

  graterWorkExperince(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const value = control.value as Date;
      console.log(value);
      if (control.touched) {
        if (value != null) {
          const fromdate = this.workExperienceForm.get('fromDate')?.value;
          console.log(fromdate);
          if (fromdate == null) {
            return { fromdate: true };
          }
          if (fromdate > value) {
            return { graterWorkExperince: true };
          }
        }
      }

      return null;
    };
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.workExperienceForm.get(controlName);

    return !!control && control.invalid && control.touched;
  }

  getErrorMessage(controlName: string): string {
    const control = this.workExperienceForm.get(controlName);

    if (control && control.errors) {
      const errorKey = Object.keys(control.errors)[0];

      return CustomValidators.getErrorMessage(errorKey, controlName);
    }

    return '';
  }

  getById(id: number, workExperienceId: number) {
    // Retrieve the work experience by ID and populate the form fields

    this.workExperienceService

      .getWorkExperienceById(id, workExperienceId)

      .subscribe((response: WorkExperience) => {
        console.log(response);

        this.workExperienceForm.patchValue(response);
      });
  }

  closeDialog(isUpdate: boolean) {
    this.dialogRef.close(isUpdate);
  }

  resetForm() {
    this.collectQueryParams();

    this.initForm();
  }

  onCancel() {
    this.closeDialog(false);
  }
}
