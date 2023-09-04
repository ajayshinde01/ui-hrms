import { Component, Inject, OnInit, ViewChild } from '@angular/core';

import { EmailTemplate } from '../../../models/emailTemplate';
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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditorComponent } from '@ckeditor/ckeditor5-angular';
@Component({
  selector: 'app-email-template-form',
  templateUrl: './email-template-form.component.html',
  styleUrls: ['./email-template-form.component.scss'],
})
export class EmailTemplateFormComponent implements OnInit {
  @ViewChild('ckeditorEleRef')
  ckeditorElementComponent!: CKEditorComponent;
  public Editor: any = ClassicEditor;

  emailTemplateForm!: FormGroup;
  emailtemplate: EmailTemplate;
  submitted: boolean = false;
  queryParams?: Params;
  isDisabled: boolean = false;
  errorMessage: string = '';
  

  actionLabel: string = 'Save';
  constructor(
    private _mdr: MatDialogRef<EmailTemplateFormComponent>,
    @Inject(MAT_DIALOG_DATA) data: string,
    public emailTemplateService: EmailtemplateService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.collectQueryParams();
    this.initForm();

    this.emailTemplateForm
      .get('name')
      ?.valueChanges.subscribe((value: string) => {
        if (value.length > 0) {
          const firstLetter = value.charAt(0).toUpperCase();

          const restOfValue = value.slice(1);

          const newValue = firstLetter + restOfValue;

          this.emailTemplateForm
            .get('name')
            ?.setValue(newValue, { emitEvent: false });
        }
      });
    this.emailTemplateForm
      .get('subject')
      ?.valueChanges.subscribe((value: string) => {
        if (value.length > 0) {
          const firstLetter = value.charAt(0).toUpperCase();

          const restOfValue = value.slice(1);

          const newValue = firstLetter + restOfValue;

          this.emailTemplateForm
            .get('subject')
            ?.setValue(newValue, { emitEvent: false });
        }
      });
  }

  collectQueryParams() {
    this.route.queryParams.subscribe((params) => {
      this.queryParams = params;

      if (this.queryParams['id'] != undefined) {
        console.log(this.queryParams['id']);
        this.actionLabel = 'Update';
        this.getById(this.queryParams['id']);
        this.isDisabled = true;
      } else {
        this.actionLabel = 'Save';
      }
    });
  }

  goBack() {
    this.router.navigate(['/master/department-table']);
  }
  initForm() {
    this.emailTemplateForm = this.formBuilder.group({
      id: [''],

      name: [
        '',
        [
          Validators.required,
          leadingSpaceValidator,
          trailingSpaceValidator,
          nameMaxLength,
          blankValidator,
          Validators.pattern('^[a-zA-Z0-9\\s\\-._]+$'),
        ],
      ],
      subject: [
        '',
        [
          Validators.required,
          leadingSpaceValidator,
          trailingSpaceValidator,
          nameMaxLength,
          blankValidator,
          Validators.pattern('^[a-zA-Z0-9\\s\\-._]+$'),
        ],
      ],
      content: ['',Validators.required],
      createdBy: ['Admin'],
      updatedBy: ['Admin'],
      createdAt: [null],
      updatedAt: [null],
    });
  }

  onSubmit() {
    if (this.emailTemplateForm.valid) {
      //   this.emailTemplateForm.get('id')?.enable();
      const formData = this.emailTemplateForm.value;
      // formData.updatedBy = 'Admin';

      if (this.actionLabel === 'Save') {
        this.emailTemplateService.createEmailTemplate(formData).subscribe(
          (response: EmailTemplate) => {
            this.emailTemplateService.notify(
              'Email template added successfully'
            );

            this.Close(true);
          },
          (error: any) => {
            if (error.status == 400 || error.status == 404) {
              this.errorMessage = error.error.message;
              this.emailTemplateService.warn(this.errorMessage);
            }
          }
        );
      }
      if (this.actionLabel === 'Update') {
        //  formData.updatedBy = 'Admin';
        this.emailTemplateService.updateEmailTemplateById(formData).subscribe(
          (response: EmailTemplate) => {
            this.emailTemplateService.notify(
              'Email template updated successfully'
            );

            this.Close(true);
          },
          (error: any) => {
            if (error.status == 400 || error.status == 404) {
              this.emailTemplateService.warn('Credentials already present');
            }
          }
        );
      }
    }
  }
  getById(id: number) {
    this.emailTemplateService
      .searchEmailTemplateById(id)
      .subscribe((response: EmailTemplate) => {
        this.emailTemplateForm.patchValue(response);
        this.emailtemplate = response;
      });
  }

  Close(isUpdate: boolean) {
    this._mdr.close(isUpdate);
  }

  resetForm() {
    this.collectQueryParams();
    this.initForm();
  }
}
