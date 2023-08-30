import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Router, Data } from '@angular/router';
import { ColumnsMetadata } from '../../../models/columns-metadata';
import { ApiResponse } from '../../../models/response';
import { EmergencyContactComponent } from '../../forms/emergency-contact/emergency-contact.component';
import { EmergencyContacts } from '../../../models/emergency-contacts.model';
import { EmergencyContactsService } from '../../../services/emergency-contacts.service';

@Component({
  selector: 'app-emergency-contacts-table',
  templateUrl: './emergency-contacts-table.component.html',
  styleUrls: ['./emergency-contacts-table.component.scss'],
})
export class EmergencyContactsTableComponent {
  @Output() sendDataEvnt = new EventEmitter<number>();
  buttonVisible: Array<boolean> = [true, true, true];
  queryParams?: any;

  matDialogRef: MatDialogRef<EmergencyContactComponent>;

  contactMetaData: {
    content: Array<EmergencyContacts>;
    totalElements: number;
  } = {
    content: [],
    totalElements: 0,
  };
  contactHeaders: { columnsMetadata: Array<ColumnsMetadata> } = {
    columnsMetadata: [],
  };
  params: HttpParams = new HttpParams();

  masterName: string = 'contact';

  constructor(
    private contactService: EmergencyContactsService,
    private router: Router,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getHeaders();
    let params = new HttpParams();
    params = params.set('page', 0);
    params = params.set('size', 10);
    this.searchFunction(params);
  }

  getHeaders() {
    this.contactService.getcontactHeaders().subscribe(
      (response: { columnsMetadata: Array<ColumnsMetadata> }) => {
        console.log('GET-HEADERS Request successful', response);
        this.contactHeaders = response;
        console.log(this.contactHeaders);
      },
      (error: any) => {
        console.error('GET Request failed', error);
      }
    );
  }

  action(event: Data) {
    let type: string = event['event'];
    let id: string = event['data'].contactId;
    const queryParam = { id: id };

    switch (type) {
      case 'delete':
        this.contactService
          .deleteContact(event['data'].contactId, this.queryParams.id)
          .subscribe(
            (response: ApiResponse) => {
              console.log('DELETE-ROLE Request successful', response);

              this.contactService.notify('Role deleted successfully');

              this.searchFunction(this.params);

              const currentPage = Number(this.params.get('page'));

              if (
                this.contactMetaData.content.length === 1 &&
                currentPage > 0
              ) {
                const newPage = currentPage - 1;

                this.params = this.params.set('page', newPage.toString());

                this.searchFunction(this.params);
              }
            },
            (error: any) => {
              console.error('DELETE-ROLE Request failed', error);
            }
          );

        break;

      case 'add':
        this.OpenModal();
        // this.router.navigate(['/master/role']);
        break;

      case 'edit':
        this.OpenModalForEdit(id);
        // this.router.navigate(['/master/role'], { queryParams: queryParam });
        break;
    }
  }

  searchFunction(params: HttpParams) {
    debugger;
    this.params = params;
    this.contactService
      .search(params, this.queryParams.id)
      .subscribe(
        (data: {
          content: Array<EmergencyContacts>;
          totalElements: number;
        }) => {
          this.contactMetaData = data;
        }
      );
  }

  OpenModal() {
    this.matDialogRef = this.matDialog.open(EmergencyContactComponent, {
      disableClose: true,
    });

    this.matDialogRef.afterClosed().subscribe((res: any) => {
      this.searchFunction(this.params);
      if (res == true) {
      }
    });
  }

  OpenModalForEdit(data: string) {
    this.matDialogRef = this.matDialog.open(EmergencyContactComponent, {
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
