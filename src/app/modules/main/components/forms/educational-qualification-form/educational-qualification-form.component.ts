import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { EducationalQualificationService } from '../../../services/educational-qualification.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EducationalQualification } from '../../../models/educational-qualification.model';
import { CommonMaster } from '../../../models/common-master.model';
import { CustomValidators } from '../../../services/custom-validators.service';

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
  qualificationLevels: CommonMaster[] = [];
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
    this.getEducationalQualifications();
  }
  getEducationalQualifications() {
    this.educationalQualificationService
      .getQualificationLevels()
      .subscribe((Response) => {
        this.qualificationLevels = Response;
      });
  }

  collectQueryParams() {
    this.educationalQualificationId = this.data['educationalQualificationId'];
    this.employeeId = this.data['id'];
    this.getById(this.employeeId, this.educationalQualificationId);
    this.isDisabled = true;
  }

  initForm() {
    this.educationalDetailsForm = this.formBuilder.group({
      id: [''],
      educationalQualification: [
        '',
        [
          Validators.required,
          CustomValidators.noLeadingSpace(),
          CustomValidators.whitespaceValidator(),
          CustomValidators.noTrailingSpace(),
          CustomValidators.educationalQualificationMaxLength(50),
          Validators.pattern('^[A-Za-z\\s.-]{1,50}'),
        ],
      ],
      qualificationLevel: ['', Validators.required],
      instituteName: [
        '',
        [
          Validators.required,
          CustomValidators.noLeadingSpace(),
          CustomValidators.noTrailingSpace(),
          CustomValidators.instituteNameMaxLength(100),
          Validators.pattern('^[A-Za-z\\s.-]{1,100}'),
        ],
      ],
      passingYear: ['', Validators.required],
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
                'Educational Qualification added successfully..!'
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

  isControlInvalid(controlName: string): boolean {
    const control = this.educationalDetailsForm.get(controlName);
    return !!control && control.invalid && control.touched;
  }

  getErrorMessage(controlName: string): string {
    const control = this.educationalDetailsForm.get(controlName);
    if (control && control.errors) {
      const errorKey = Object.keys(control.errors)[0];
      return CustomValidators.getErrorMessage(errorKey, controlName);
    }
    return '';
  }
}
