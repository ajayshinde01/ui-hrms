import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { EducationalQualificationService } from '../../../services/educational-qualification.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Certification } from '../../../models/certification.model';
import { CertificationService } from '../../../services/certification.service';
import { CustomValidators } from '../../../services/custom-validators.service';
import * as moment from 'moment';
import { FirstLetterCapitalService } from 'src/app/modules/shared/services/first-letter-capital.service';

@Component({
  selector: 'app-certification-form',
  templateUrl: './certification-form.component.html',
  styleUrls: ['./certification-form.component.scss'],
})
export class CertificationFormComponent implements OnInit {
  certificationsForm!: FormGroup;
  submitted: boolean = false;
  queryParams: any;
  actionLabel: string = 'Save';
  isDisabled: boolean = false;
  certificationsId: number;
  orgCode = sessionStorage.getItem('orgCode');

  employeeId: number;
  constructor(
    private _mdr: MatDialogRef<CertificationFormComponent>,
    private formBuilder: FormBuilder,
    private certificationService: CertificationService,
    private router: Router,
    private route: ActivatedRoute,
    private capitalService: FirstLetterCapitalService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {

    this.initForm();
    this.collectQueryParams();

    const formControlNames = ['certification', 'issuedBy'];

    formControlNames.forEach((controlName) => {
      this.certificationsForm
        .get(controlName)
        ?.valueChanges.subscribe((value: string) => {
          if (value.length > 0) {
            const newValue = this.capitalService.capitalizeFirstLetter(value);
            this.certificationsForm
              .get(controlName)
              ?.setValue(newValue, { emitEvent: false });
          }
        });
    });
  }

  collectQueryParams() {
    this.certificationsId = this.data['certificationsId'];
    this.employeeId = this.data['id'];
    this.getById(this.employeeId, this.certificationsId);
    this.isDisabled = true;
  }

  initForm() {
    this.certificationsForm = this.formBuilder.group({
      id: [''],
      certification: [
        '',
        [
          Validators.required,
          CustomValidators.noLeadingTrailingSpace(),
          CustomValidators.noLeadingSpace(),
          CustomValidators.noTrailingSpace(),
          CustomValidators.certificationMaxLength(100),
          Validators.pattern('^[A-Za-z0-9\\s.-]{1,100}'),
        ],
      ],
      issuedBy: [
        '',
        [
          Validators.required,
          CustomValidators.noLeadingTrailingSpace(),
          CustomValidators.noLeadingSpace(),
          CustomValidators.noTrailingSpace(),
          CustomValidators.issuedByMaxLength(100),
          Validators.pattern('^[A-Za-z0-9\\s.-]{1,100}'),
        ],
      ],
      dateOfCertification: [
        '',
        [Validators.required, CustomValidators.pastDate()],
      ],
      orgCode: { value: this.orgCode },
      createdBy: ['Admin'],
      updatedBy: ['Admin'],
      createdAt: [null],
      updatedAt: [null],
    });
  }

  onSubmit() {
    if (this.certificationsForm.valid) {
      const formData = {
        ...this.certificationsForm.value,
        confirmationDate: moment(
          this.certificationsForm.value.dateOfCertification
        )
          .utcOffset(0, true)
          .format('YYYY-MM-DD'),
      };

      if (this.actionLabel === 'Save') {
        this.certificationService
          .createCertifications(formData, this.employeeId)
          .subscribe(
            (response: Certification) => {
              this.certificationService.notify(
                'Certification Added Successfully..!'
              );
              this.Close(true);
            },

            (error: any) => {
              if (error.status == 400 || error.status == 404) {
                this.certificationService.warn('Certification Already Present');
              }

              console.error('POST Request failed', error);
            }
          );
      }

      if (this.actionLabel === 'Update') {
        this.certificationService
          .updateCertification(formData, this.employeeId)
          .subscribe(
            (response: Certification) => {
              this.certificationService.notify(
                'Certification added successfully..!'
              );
              this.Close(true);
            },
            (error: any) => {
              if (error.status == 404) {
                this.certificationService.warn('Certification already present');
              }

              console.error('PUT Request failed', error);
            }
          );
      }
    }
  }

  getById(id: number, certificationsId: number) {

    this.certificationService.getByEmployeeId(id, certificationsId).subscribe(
      (response) => {
        this.certificationsForm.patchValue(response);
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
    const control = this.certificationsForm.get(controlName);
    return !!control && control.invalid && control.touched;
  }

  getErrorMessage(controlName: string): string {
    const control = this.certificationsForm.get(controlName);
    if (control && control.errors) {
      const errorKey = Object.keys(control.errors)[0];
      return CustomValidators.getErrorMessage(errorKey, controlName);
    }
    return '';
  }
}
