import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ColumnsMetadata } from '../../../models/columnMetaData';
import { Data, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { ApiResponse } from '../../../models/response';
import { EmailFormComponent } from '../../forms/email-form/email-form.component';

import { Email } from '../../../models/email';
import { EmailService } from '../../../services/email.service';

@Component({
  selector: 'app-email-table',
  templateUrl: './email-table.component.html',
  styleUrls: ['./email-table.component.scss'],
})
export class EmailTableComponent {
  @Output() sendDataEvnt = new EventEmitter<number>();
  buttonVisible: Array<boolean> = [true, false, false,true];
  matDialogRef: MatDialogRef<EmailFormComponent>;

  emailHeaders: { columnsMetadata: Array<ColumnsMetadata> } = {
    columnsMetadata: [],
  };


  // emailMetaData: { content: Array<Email>; totalElements: number } = {
  //   content: [],

  //   totalElements: 0,
  // };
  emailMetaData:any
  isViewMode: boolean = false;

  params: HttpParams = new HttpParams();

  masterName: string = 'Email';

  constructor(
    public emailService: EmailService,

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
    this.emailService.getEmailHeaders().subscribe(
      (response: { columnsMetadata: Array<ColumnsMetadata> }) => {
        this.emailHeaders = response;

      },

      (error: any) => {
        console.error('GET Request failed', error);
      }
    );
  }

  action(event: Data) {
    let type: string = event['event'];

    let id: string = event['data'].id;

    const queryParam = { id: id };

    switch (type) {
      // case 'delete':
      //   this.emailService

      //     .deleteEmail(event['data'].id)

      //     .subscribe(
      //       (response: ApiResponse) => {
      //         this.emailService.notify('Email deleted successfully');

      //         this.searchFunction(this.params);

      //         const currentPage = Number(this.params.get('page'));

      //         if (
      //           this.emailMetaData.content.length === 1 &&
      //           currentPage > 0
      //         ) {
      //           const newPage = currentPage - 1;

      //           this.params = this.params.set('page', newPage.toString());

      //           this.searchFunction(this.params);
      //         }
      //       },

      //       (error: any) => {
      //         console.error('DELETE-Email Request failed', error);
      //       }
      //     );

      //  break;

      case 'add':
        this.OpenModal();

        this.router.navigate(['/master/emailtable']);

        break;

          case 'view':
            this.OpenModalForEdit(id);
            
            this.router.navigate(['/master/emailtable'], {
              queryParams: queryParam,
            });

            break;
    }
  }

  searchFunction(params: HttpParams) {
    this.params = params;
    this.emailService

      .search(params)

      .subscribe((data: { content: Array<Email>; totalElements: number }) => {
        

        this.emailMetaData = data.content
        
      });
  }

  OpenModal() {
    this.matDialogRef = this.matDialog.open(EmailFormComponent, {
      disableClose: true,
    });

    this.matDialogRef.afterClosed().subscribe((res: any) => {
      this.searchFunction(this.params);

      if (res == true) {
      }
    });
  }

  OpenModalForEdit(data: string) {
    this.isViewMode = true;
    this.matDialogRef = this.matDialog.open(EmailFormComponent, {
      data: { id: data },

      disableClose: true,
    });

    this.matDialogRef.afterClosed().subscribe((res: any) => {
      this.searchFunction(this.params);

      if (res == true) {
      }
    });
  }
}
