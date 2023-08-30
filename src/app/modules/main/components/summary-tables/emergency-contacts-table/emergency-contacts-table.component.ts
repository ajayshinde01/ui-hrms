import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Router, Data } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ColumnsMetadata } from '../../../models/columns-metadata';
import { ApiResponse } from '../../../models/response';
import { EmergencyContactComponent } from '../../forms/emergency-contact/emergency-contact.component';
import { EmergencyContacts } from '../../../models/emergency-contacts.model';
import { EmergencyContactsService } from '../../../services/emergency-contacts.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-emergency-contacts-table',
  templateUrl: './emergency-contacts-table.component.html',
  styleUrls: ['./emergency-contacts-table.component.scss'],
})
export class EmergencyContactsTableComponent {
  @Output() sendDataEvnt = new EventEmitter<number>();
  matDialogRef: MatDialogRef<EmergencyContactComponent>;
  id: number;
  // contactHeaders: any;
  emergencyContactMetaData: {
    content: Array<EmergencyContacts>;
    totalElements: number;
  } = {
    content: [],
    totalElements: 0,
  };
  emergencyContactHeaders: { columnsMetadata: Array<ColumnsMetadata> } = {
    columnsMetadata: [],
  };
  params: HttpParams = new HttpParams(); // Create an instance of HttpParams

  constructor(
    private contactService: EmergencyContactsService, // Update the service name

    private route: ActivatedRoute,

    private matDialog: MatDialog,

    private toastrService: ToastrService // Update the service name
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.id = params['id'];
    });

    this.getHeaders();

    let params = new HttpParams(); // Create an instance of HttpParams

    params = params.set('page', '0'); // Set page as a string

    params = params.set('size', '10'); // Set size as a string

    this.searchFunction(params);
  }

  getHeaders() {
    this.contactService

      .getEmergencyContactHeaders() // Update the service method name

      .subscribe(
        (response: { columnsMetadata: Array<ColumnsMetadata> }) => {
          this.emergencyContactHeaders = response;
        },

        (error: any) => {
          console.error('GET Request failed', error);
        }
      );
  }

  action(event: any) {
    let type: string = event['event'];

    let id: string = event['data'].id;

    const queryParam = { emergencyContactId: id }; // Update the query parameter name

    switch (type) {
      case 'delete':
        this.contactService // Update the service name

          .deleteEmergencyContact(event['data'].id, this.id) // Update the service method name and parameters

          .subscribe(
            (response: ApiResponse) => {
              console.log(
                'DELETE-Emergency Contact Request successful',
                response
              );

              this.toastrService.success(
                'Emergency Contact deleted successfully'
              ); // Update the service name

              this.searchFunction(this.params);

              const currentPage = Number(this.params.get('page'));

              if (
                this.emergencyContactMetaData.content.length === 1 &&
                currentPage > 0
              ) {
                const newPage = currentPage - 1;
                this.params = this.params.set('page', newPage.toString());
                this.searchFunction(this.params);
              }
            },
            (error: any) => {
              console.error('DELETE-Emergency Contact Request failed', error);
            }
          );
        break;
      case 'add':
        this.openModal(); // Update the method name
        break;
      case 'edit':
        this.openModalForEdit(id, this.id); // Update the method name and parameters
        break;
    }
  }
  searchFunction(params: HttpParams) {
    this.params = params;
    this.contactService
      .search(params, this.id) // Call the method with parameters like this
      .subscribe(
        (data: {
          content: Array<EmergencyContacts>;
          totalElements: number;
        }) => {
          this.emergencyContactMetaData = data;
        }
      );
  }
  openModal() {
    this.matDialogRef = this.matDialog.open(
      EmergencyContactComponent, // Update the component name
      {
        data: {
          employeeId: this.id,
        },
        disableClose: true,
      }
    );
    this.matDialogRef.afterClosed().subscribe((res: any) => {
      this.searchFunction(this.params);
      if (res == true) {
        // Do something if necessary
      }
    });
  }
  openModalForEdit(data: string, id: number) {
    this.matDialogRef = this.matDialog.open(
      EmergencyContactComponent, // Update the component name
      {
        data: {
          emergencyContactId: data, // Update the property name
          employeeId: this.id,
        },
        disableClose: true,
      }
    );
    this.matDialogRef.afterClosed().subscribe((res: any) => {
      this.searchFunction(this.params);
      if (res == true) {
        // Do something if necessary
      }
    });
  }
}
