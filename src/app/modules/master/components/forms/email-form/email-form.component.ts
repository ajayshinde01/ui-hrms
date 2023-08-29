import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EmailtemplateService } from '../../../services/emailtemplate.service';
import { leadingSpaceValidator } from '../Validations/leadingSpace.validator';
import { trailingSpaceValidator } from '../Validations/trailingSpace.validator';
import { nameMaxLength } from '../Validations/nameMaxLength.validator';
import { blankValidator } from '../Validations/blankData.validator';

import { Email } from '../../../models/email';
import { EmailService } from '../../../services/email.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditorComponent } from '@ckeditor/ckeditor5-angular';
@Component({
  selector: 'app-email-form',
  templateUrl: './email-form.component.html',
  styleUrls: ['./email-form.component.scss']
})
export class EmailFormComponent implements OnInit
{
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('ckeditorEleRef')
  ckeditorElementComponent!: CKEditorComponent;
  public Editor:any = ClassicEditor;
  emailForm!: FormGroup;
  email: Email;
  submitted: boolean = false;
  queryParams?: Params;
  isDisabled: boolean = false;
  errorMessage: string = '';
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
  ) {}
  ngOnInit(): void {
    this.collectQueryParams();
    this.initForm();

  }
  collectQueryParams() {
    this.route.queryParams.subscribe((params) => {
      this.queryParams = params;

      if (this.queryParams['id'] != undefined) {
        console.log(this.queryParams['id']);
        this.actionLabel = 'Update';
      //  this.getById(this.queryParams['id']);
        this.isDisabled = true;
      } else {
        this.actionLabel = 'Save';
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

 

  // goBack() {
  //   this.router.navigate(['/master/department-table']);
  // }
  initForm() {
    this.emailForm = this.formBuilder.group({
      id: [''],
      to: ['',Validators.required],
      cc: ['',Validators.required],
      subject:['',Validators.required],
      dateTime:['',Validators.required],
      file:[''],
      timeZone:['Asia/Kokata',Validators.required],
      body:['',Validators.required],
    
    });
  }

  // onSubmit() {
  //   if (this.emailForm.valid) {
   

   

  //     // if (this.actionLabel === 'Send') {
  //     //   this.emailService.createEmail(formData).subscribe(
  //     //     (response: Email) => {
  //     //       this.emailService.notify('Email added successfully');

  //     //       this.Close(true);
  //     //     },
  //     //     (error: any) => {
  //     //       if (error.status == 400 || error.status == 404) {
  //     //         this.errorMessage = error.error.message;
  //     //         this.emailService.warn(this.errorMessage);
  //     //       }
  //     //     }
  //     //   );
  //     // }


  //     // if (this.actionLabel === 'Update') {
  //     // //  formData.updatedBy = 'Admin';
  //     //   this.emailService.updateEmailTemplateById(formData).subscribe(
  //     //     (response: EmailTemplate) => {
  //     //       this.emailTemplateService.notify('Email template updated successfully');

  //     //       this.Close(true);
  //     //     },
  //     //     (error: any) => {
  //     //       if (error.status == 400 || error.status == 404) {
  //     //         this.emailTemplateService.warn('Credentials already present');
  //     //       }
  //     //     }
  //     //   );
  //     // }
  //   }
  // }

  onSubmit() {
    if (this.emailForm.valid) {
      const mailRequest = new FormData();
      
      mailRequest.append('to', JSON.stringify(this.emailForm.get('to')?.value));
      mailRequest.append('cc', JSON.stringify(this.emailForm.get('cc')?.value));
      mailRequest.append('subject', JSON.stringify(this.emailForm.get('subject')?.value));
      mailRequest.append('body', JSON.stringify(this.emailForm.get('body')?.value));
      mailRequest.append('dateTime', JSON.stringify(this.emailForm.get('dateTime')?.value));
      mailRequest.append('timeZone', JSON.stringify(this.emailForm.get('timeZone')?.value));
  

      const files: FileList = this.fileInput.nativeElement.files;
    for (let i = 0; i < files.length; i++) {
      mailRequest.append('file', files[i]);
    }
      // const fileInput = document.getElementById('fileInput') as HTMLInputElement;
      // if (fileInput.files && fileInput.files.length > 0) {
      //   mailRequest.append('file', fileInput.files[0]);
      // }
      // const fetchOptions: RequestInit = {
      //   method: 'POST',
      //   body: mailRequest,
      // };
      // fetch('http://192.168.1.16:7010/email/send', fetchOptions)
      // .then(response => response.json())
      // .then(data => {
      //   // Handle success
      //   this.emailService.notify('Email sent successfully');
      //   this.Close(true);
      // })
      // .catch(error => {
      //   // Handle error
      //   this.errorMessage = error.message;
      //   this.emailService.warn(this.errorMessage);
      // });
  
      this.emailService.createEmail(mailRequest,this.selectedFile).subscribe(
        (response: any) => {
          // Handle success
          this.emailService.notify('Email sent successfully');
          this.Close(true);
        },
        (error: any) => {
          // Handle error
          if (error.status == 400 || error.status == 404) {
            this.errorMessage = error.error.message;
            this.emailService.warn(this.errorMessage);
          }
        }
      );
    }
  }


  
  // getById(id: number) {
  //   this.emailTemplateService
  //     .searchEmailTemplateById(id)
  //     .subscribe((response: EmailTemplate) => {
  //       this.emailTemplateForm.patchValue(response);
  //       this.emailtemplate = response;
  //     });
  // }

  Close(isUpdate: boolean) {
    this._mdr.close(isUpdate);
  }

  resetForm() {
    this.collectQueryParams();
    this.initForm();
  }
 
}
