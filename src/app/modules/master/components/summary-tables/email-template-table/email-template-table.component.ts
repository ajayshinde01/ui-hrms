import { Component, EventEmitter, Output } from '@angular/core';
import { EmailTemplateFormComponent } from '../../forms/email-template-form/email-template-form.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ColumnsMetadata } from '../../../models/columnMetaData';
import { EmailTemplate } from '../../../models/emailTemplate';
import { EmailtemplateService } from '../../../services/emailtemplate.service';
import { Data, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { ApiResponse } from '../../../models/response';
@Component({
  selector: 'app-email-template-table',
  templateUrl: './email-template-table.component.html',
  styleUrls: ['./email-template-table.component.scss'],
})
export class EmailTemplateTableComponent {
  @Output() sendDataEvnt = new EventEmitter<number>();
  buttonVisible: Array<boolean> = [true, true, true];
  matDialogRef: MatDialogRef<EmailTemplateFormComponent>;

  emailTemplateHeaders: { columnsMetadata: Array<ColumnsMetadata> } = {
    columnsMetadata: [],
  };

  emailTemplateMetaData: {
    content: Array<EmailTemplate>;
    totalElements: number;
  } = {
    content: [],

    totalElements: 0,
  };

  params: HttpParams = new HttpParams();

  masterName: string = 'Email Template';


  constructor(
    public emailtemplateService: EmailtemplateService,

    private router: Router,

    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getHeaders();

    this.params = this.params.set('page', 0);

    this.params = this.params.set('size', 10);

    this.searchFunction(this.params);
  }

  getHeaders() {
    this.emailtemplateService.getEmailTemplateHeaders().subscribe(
      (response: { columnsMetadata: Array<ColumnsMetadata> }) => {
        this.emailTemplateHeaders = response;

        console.log(this.emailTemplateHeaders);
      },

      (error: any) => {
        console.error('GET Request failed', error);
      }
    );
  }

  action(event: Data) {
    let type: string = event['event'];

    let id: number = event['data'].id;

    const queryParam = { id: id };

    switch (type) {
      case 'delete':
        this.emailtemplateService

          .deleteEmailTemplate(event['data'].id)

          .subscribe(
            (response: ApiResponse) => {
              this.emailtemplateService.notify(
                'EmailTemplate deleted successfully'
              );

              this.searchFunction(this.params);

              const currentPage = Number(this.params.get('page'));

              if (
                this.emailTemplateMetaData.content.length === 1 &&
                currentPage > 0
              ) {
                const newPage = currentPage - 1;

                this.params = this.params.set('page', newPage.toString());

                this.searchFunction(this.params);
              }
            },

            (error: any) => {
              console.error('DELETE-Department Request failed', error);
            }
          );

        break;

      case 'add':
        this.OpenModal();

        this.router.navigate(['/master/emailtemplatetable']);

        break;

      case 'edit':
        this.OpenModalForEdit(id);

        this.router.navigate(['/master/emailtemplatetable'], {
          queryParams: queryParam,
        });

        break;
    }
  }

  searchFunction(params: HttpParams) {
    this.params = params;

    this.emailtemplateService

      .search(params)

      .subscribe(
        (data: { content: Array<EmailTemplate>; totalElements: number }) => {
          console.log(data.content);

          console.log(data.totalElements);

          this.emailTemplateMetaData = data;
        }
      );
  }

  OpenModal() {
    this.matDialogRef = this.matDialog.open(EmailTemplateFormComponent, {
      disableClose: true,
    });

    this.matDialogRef.afterClosed().subscribe((res: any) => {
      this.searchFunction(this.params);

      if (res == true) {
      }
    });
  }

  OpenModalForEdit(id: number) {
    this.matDialogRef = this.matDialog.open(EmailTemplateFormComponent, {
      data: { id: id },

      disableClose: true,
    });

    this.matDialogRef.afterClosed().subscribe((res: any) => {
      this.searchFunction(this.params);

      if (res == true) {
      }
    });
  }
}
