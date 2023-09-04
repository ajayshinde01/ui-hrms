
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { EmailtemplateService } from '../../../services/emailtemplate.service';
import { leadingSpaceValidator } from '../Validations/leadingSpace.validator';
import { trailingSpaceValidator } from '../Validations/trailingSpace.validator';
import { nameMaxLength } from '../Validations/nameMaxLength.validator';
import { blankValidator } from '../Validations/blankData.validator';
import { CKEditorComponent } from '@ckeditor/ckeditor5-angular';
import { Email } from '../../../models/email';
import { EmailService } from '../../../services/email.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { whitespaceValidator } from '../Validations/whiteSpace.validator';
import { emailMaxLength } from 'src/app/modules/user/components/forms/Validations/emailMaxLength.validator';
@Component({
  selector: 'app-email-form',
  templateUrl: './email-form.component.html',
  styleUrls: ['./email-form.component.scss'],
})
export class EmailFormComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('ckeditorEleRef')
  ckeditorElementComponent!: CKEditorComponent;
  public Editor: any = ClassicEditor;
  emailForm!: FormGroup;
  email: Email;
  submitted: boolean = false;
  queryParams?: Params;
  isReadOnly: boolean = false;
  recordSelected: boolean = false;

// data:any={
// name:''
// }

  errorMessage: string = '';
  isFieldHidden: boolean = false;
  selectedFile: File;

  actionLabel: string = 'Send';
  constructor(
    private _mdr: MatDialogRef<EmailFormComponent>,
    @Inject(MAT_DIALOG_DATA) data: string,
    public emailService: EmailService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) { }
  ngOnInit(): void {
    this.collectQueryParams();
    this.initForm();

  }

  collectQueryParams() {
    this.route.queryParams.subscribe((params) => {
      this.queryParams = params;

      if (this.queryParams['id'] != undefined) {

        this.getById(this.queryParams['id']);
        // this.isDisabled=true;
      } else {
        this.actionLabel = 'Send';

      }
    });
  }
  getFileIconClass(fileType: string): string {
    const iconMap: { [key: string]: string } = {
      'image/jpeg': 'fas fa-file-image',
      'image/png': 'fas fa-file-image',
      'application/pdf': 'fas fa-file-pdf',
      'text/plain': 'fas fa-file-alt',
    };

    return iconMap[fileType] || 'fas fa-file';
  }
  createEmail(event: any) {
    this.selectedFile = event.target.files[0];
  }

  initForm() {
    this.emailForm = this.formBuilder.group({
      id: [''],
      to: ['',
      
        [
          Validators.required,

          
        ],],
      cc: ['',
        [
          Validators.required
        ]],
      subject: ['',
        [
          Validators.required
        ]],
      dateTime: ['',Validators.required],
      timeZone: ['Asia/Kolkata',Validators.required],
      body: ['',Validators.required],
      file: [''],
      startTime: ['']
      // name:[this.data.name]
    });
  }


  onSubmit() {
    if (this.emailForm.valid) {
      console.log(this.emailForm)
      const formData = new FormData();
      const value = { ...this.emailForm.getRawValue() };
      value.to = value.to.split(',');
      value.cc = value.cc.split(',');
      formData.append('file', this.selectedFile);
      let blob = new Blob([JSON.stringify(value)], { type: 'application/json' });
      formData.append('mailRequest', blob);

      if (this.actionLabel === 'Send') {

        this.emailService.createEmail(formData).subscribe(
          (response: Email) => {
            this.emailService.notify('Email added successfully');
            this.Close(true);
          },
          (error: any) => {
            if (error.status == 400 || error.status == 404) {
              this.errorMessage = error.error.message;
              this.emailService.warn(this.errorMessage);
            }
          }
        );
      }

    }
  }

  getById(id: string) {
    this.isReadOnly = true;
    this.recordSelected = true;
  //this.emailForm.get('body')?.disable();
    this.emailService
      .searchEmailById(id)
      .subscribe((response: Email) => {
        this.emailForm.patchValue(response);
        this.email = response;

      });
  }

  Close(isUpdate: boolean) {
    this.isReadOnly = false;
    this._mdr.close(isUpdate);
  }

  resetForm() {
    this.collectQueryParams();
    this.initForm();
  }

}
