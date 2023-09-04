import { Component, Inject, Input, OnInit } from '@angular/core';
import { EmergencyContacts } from '../../../models/emergency-contacts.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { EmergencyContactsService } from '../../../services/emergency-contacts.service';
import { CustomValidators } from '../../../services/custom-validators.service';
import { FirstLetterCapitalService } from 'src/app/modules/shared/services/first-letter-capital.service';

@Component({
  selector: 'app-emergency-contact',
  templateUrl: './emergency-contact.component.html',
  styleUrls: ['./emergency-contact.component.scss'],
})
export class EmergencyContactComponent implements OnInit {
  emergencyContactForm!: FormGroup;
  orgCode = sessionStorage.getItem('orgCode');

  submitted: boolean = false;
  queryParams: Params;
  actionLabel: string = 'Save';
  isDisabled: boolean = false;
  emergencyContactId: number;
  employeeId: number;
  constructor(
    private _mdr: MatDialogRef<EmergencyContactComponent>,
    private formBuilder: FormBuilder,
    private contactService: EmergencyContactsService,
    private router: Router,
    private route: ActivatedRoute,
    private capitalService: FirstLetterCapitalService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.collectQueryParams();
    const formControlNames = ['emergencyContactName'];

    formControlNames.forEach((controlName) => {
      this.emergencyContactForm
        .get(controlName)
        ?.valueChanges.subscribe((value: string) => {
          if (value.length > 0) {
            const newValue = this.capitalService.capitalizeFirstLetter(value);
            this.emergencyContactForm
              .get(controlName)
              ?.setValue(newValue, { emitEvent: false });
          }
        });
    });
  }

  collectQueryParams() {
    this.emergencyContactId = this.data['emergencyContactId'];
    this.employeeId = this.data['employeeId'];
    this.getById(this.employeeId, this.emergencyContactId);
    debugger;
    this.isDisabled = true;
  }

  goBack() {
    this.router.navigate(['/user/user-table']);
  }

  initForm() {
    this.emergencyContactForm = this.formBuilder.group({
      id: [''],
      emergencyContactName: [
        '',
        [
          Validators.required,
          CustomValidators.noLeadingTrailingSpace(),
          CustomValidators.noLeadingSpace(),
          CustomValidators.noTrailingSpace(),
          CustomValidators.maxLength(50),
          Validators.pattern('[A-Za-z ]+'),
        ],
      ],

      emergencyContactNumber: [
        '',
        [
          Validators.required,
          CustomValidators.noLeadingTrailingSpace(),
          CustomValidators.noLeadingSpace(),
          CustomValidators.noWhiteSpace(),
          CustomValidators.noTrailingSpace(),
          Validators.pattern('^[0-9]{10,15}$'),
        ],
      ],
      relation: [
        '',
        [
          Validators.required,
          CustomValidators.noLeadingTrailingSpace(),
          CustomValidators.noLeadingSpace(),
          CustomValidators.noTrailingSpace(),
          CustomValidators.maxLength(50),
          Validators.pattern('[A-Za-z ]+'),
        ],
      ],
      orgCode: this.orgCode,
      createdBy: ['Admin'],
      updatedBy: ['Admin'],
      createdAt: [null],
      updatedAt: [null],
    });
  }

  onSubmit() {
    if (this.emergencyContactForm.valid) {
      const formData = this.emergencyContactForm.value;

      if (this.actionLabel === 'Save') {
        this.contactService
          .AddEmergencyContact(formData, this.employeeId)
          .subscribe(
            (response: EmergencyContacts) => {
              console.log('POST-SCOPE Request successful', response);
              this.contactService.notify(
                'Emergency Contact Added Successfully..!'
              );
              this.Close(true);
            },

            (error: any) => {
              if (error.status == 400 || error.status == 404) {
                this.contactService.warn('Emergency Contact Already Present');
              }

              console.error('POST Request failed', error);
            }
          );
      }

      if (this.actionLabel === 'Update') {
        this.contactService
          .updateEmergencyContact(formData, this.employeeId)
          .subscribe(
            (response: EmergencyContacts) => {
              console.log('PUT-SCOPE Request successful', response);
              this.contactService.notify('Emergency Contact successfully..!');
              // this.router.navigate(['/main/educational-qualification']);
              this.Close(true);
            },
            (error: any) => {
              if (error.status == 404) {
                this.contactService.warn('Scope already present');
              }

              console.error('PUT Request failed', error);
            }
          );
      }
    }
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.emergencyContactForm.get(controlName);

    return !!control && control.invalid && control.touched;
  }

  getErrorMessage(controlName: string): string {
    const control = this.emergencyContactForm.get(controlName);

    if (control && control.errors) {
      const errorKey = Object.keys(control.errors)[0];

      return CustomValidators.getErrorMessage(errorKey, controlName);
    }

    return '';
  }

  getById(id: number, emergencyContactId: number) {
    this.contactService.getByEmployeeId(id, emergencyContactId).subscribe(
      (response) => {
        this.emergencyContactForm.patchValue(response);
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
