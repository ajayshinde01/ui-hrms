import { Component, Inject, Input, OnInit } from '@angular/core';
import { EmergencyContacts } from '../../../models/emergency-contacts.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { EmergencyContactsService } from '../../../services/emergency-contacts.service';

@Component({
  selector: 'app-emergency-contact',
  templateUrl: './emergency-contact.component.html',
  styleUrls: ['./emergency-contact.component.scss'],
})
export class EmergencyContactComponent implements OnInit {
  emergencyContactForm!: FormGroup;
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
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.collectQueryParams();
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
      emergencyContactName: [''],
      emergencyContactNumber: [''],
      relation: [''],
      orgCode: ['AVI-01'],
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
