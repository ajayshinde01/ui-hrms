import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { EducationalQualificationService } from '../../../services/educational-qualification.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Certification } from '../../../models/certification.model';
import { CertificationService } from '../../../services/certification.service';

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
  employeeId: number;
  constructor(
    private _mdr: MatDialogRef<CertificationFormComponent>,
    private formBuilder: FormBuilder,
    private certificationService: CertificationService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    debugger;
    this.initForm();
    this.collectQueryParams();
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
      certification: [''],
      issuedBy: [''],
      dateOfCertification: [''],
      orgCode: ['AVI-01'],
      createdBy: ['Admin'],
      updatedBy: ['Admin'],
      createdAt: [null],
      updatedAt: [null],
    });
  }

  onSubmit() {
    if (this.certificationsForm.valid) {
      const formData = this.certificationsForm.value;

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
    debugger;
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
}
