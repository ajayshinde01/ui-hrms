import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { EducationalQualificationService } from '../../../services/educational-qualification.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EducationalQualification } from '../../../models/educational-qualification.model';

@Component({
  selector: 'app-educational-qualification-form',
  templateUrl: './educational-qualification-form.component.html',
  styleUrls: ['./educational-qualification-form.component.scss'],
})
export class EducationalQualificationFormComponent implements OnInit {
  educationalDetailsForm!: FormGroup;
  submitted: boolean = false;
  queryParams: Params;
  actionLabel: string = 'Save';
  isDisabled: boolean = false;
  educationalQualificationId: number;
  employeeId: number;
  constructor(
    private _mdr: MatDialogRef<EducationalQualificationFormComponent>,
    private formBuilder: FormBuilder,
    private educationalQualificationService: EducationalQualificationService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.collectQueryParams();
  }

  collectQueryParams() {
    if (this.data['educationalQualificationId'] != undefined) {
      this.educationalQualificationId = this.data['educationalQualificationId'];
      this.employeeId = this.data['id'];
      this.getById(this.employeeId, this.educationalQualificationId);
      this.isDisabled = true;
    }
  }

  goBack() {
    this.router.navigate(['/user/user-table']);
  }

  initForm() {
    this.educationalDetailsForm = this.formBuilder.group({
      id: [''],
      educationalQualification: [''],
      qualificationLevel: [''],
      instituteName: [''],
      passingYear: [''],
      orgCode: ['AVI-01'],
      createdBy: ['Admin'],
      updatedBy: ['Admin'],
      createdAt: [null],
      updatedAt: [null],
    });
  }

  onSubmit() {
    if (this.educationalDetailsForm.valid) {
      const formData = this.educationalDetailsForm.value;

      if (this.actionLabel === 'Save') {
        this.educationalQualificationService
          .createEducationalQualification(formData, this.employeeId)
          .subscribe(
            (response: EducationalQualification) => {
              console.log('POST-SCOPE Request successful', response);
              // this.router.navigate(['/main/educational-qualification']);
              this.educationalQualificationService.notify(
                'Educational Qualification Added Successfully..!'
              );
              this.Close(true);
            },

            (error: any) => {
              if (error.status == 400 || error.status == 404) {
                this.educationalQualificationService.warn(
                  'Educational Qualification Already Present'
                );
              }

              console.error('POST Request failed', error);
            }
          );
      }

      if (this.actionLabel === 'Update') {
        this.educationalQualificationService
          .updateEducationalQualification(formData, this.employeeId)
          .subscribe(
            (response: EducationalQualification) => {
              console.log('PUT-SCOPE Request successful', response);
              this.educationalQualificationService.notify(
                'Educational Qualification successfully..!'
              );
              // this.router.navigate(['/main/educational-qualification']);
              this.Close(true);
            },
            (error: any) => {
              if (error.status == 404) {
                this.educationalQualificationService.warn(
                  'Scope already present'
                );
              }

              console.error('PUT Request failed', error);
            }
          );
      }
    }
  }

  getById(id: number, educationalqualificationId: number) {
    this.educationalQualificationService
      .getByEmployeeId(id, educationalqualificationId)
      .subscribe(
        (response) => {
          this.educationalDetailsForm.patchValue(response);
          this.actionLabel = 'Update';
        },
        (error) => {
          this.actionLabel = 'Save';
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
