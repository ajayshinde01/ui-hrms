import { Component, Inject, OnInit } from '@angular/core';

import { FormBuilder, FormGroup } from '@angular/forms';

import { ActivatedRoute, Params, Router } from '@angular/router';

import { WorkExperienceService } from '../../../services/work-experience.service';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { WorkExperience } from '../../../models/work-experience.model';

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

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.collectQueryParams();

    this.initForm();
  }

  collectQueryParams() {
    debugger;

    this.route.queryParams.subscribe((params) => {
      this.queryParams = params;

      debugger;

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

      companyName: [''],

      designation: [''],

      fromDate: [''],

      toDate: [''],

      address: [''],

      createdBy: ['Admin'],

      updatedBy: ['Admin'],

      createdAt: [null],

      updatedAt: [null],

      orgCode: ['AVI01'],
    });
  }

  onSubmit() {
    if (this.workExperienceForm.valid) {
      const formData = this.workExperienceForm.value;

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
