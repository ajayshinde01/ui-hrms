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
  params: HttpParams = new HttpParams();
  selectedProduct: any;
  @Input() inputFromParent: string;
  emergencyContactForm!: FormGroup;
  actionLabel: string = 'Save';
  contacts: EmergencyContacts;
  emp_id: any;

  constructor(
    private _mdr: MatDialogRef<EmergencyContactComponent>,
    @Inject(MAT_DIALOG_DATA) data: string,
    private contactService: EmergencyContactsService,
    private router: Router,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.emp_id = this.route.snapshot.queryParamMap.get('id'); // Replace 'paramName' with the actual query parameter name
    console.log('Query parameter value:', this.emp_id);
  }

  initForm() {
    this.emergencyContactForm = this.formBuilder.group({
      id: [''],
      emergencyContactName: [''],
      orgCode: ['AVI-123'],
      emergencyContactNumber: [''],
      relation: [''],
    });
  }

  Close(isUpdate: boolean) {
    this._mdr.close(isUpdate);
  }

  resetForm() {
    // this.collectQueryParams();
    this.initForm();
  }

  onSubmit() {
    if (this.emergencyContactForm.valid) {
      const formData = this.emergencyContactForm.value;
      if (this.actionLabel === 'Save') {
        this.contactService
          .AddEmergencyContact(formData, this.emp_id)
          .subscribe(
            (response: EmergencyContacts) => {
              this.contactService.notify('Data Saved Successfully...');
              // this.router.navigate(['/main/employee-form']);
            },
            (error: any) => {
              if (error.status == 400 || error.status == 404) {
                this.contactService.warn('Credentials already present');
              }
            }
          );
      }
      if (this.actionLabel === 'Update') {
        this.contactService
          .updateEmergencyContact(formData, this.emp_id)
          .subscribe(
            (response: EmergencyContacts) => {
              this.contactService.notify('Update Successfully...');
              // this.router.navigate(['/main/employee-table']);
            },
            (error: any) => {
              if (error.status == 400 || error.status == 404) {
                this.contactService.warn('Credentials already present');
              }
            }
          );
      }
    }
  }
}
