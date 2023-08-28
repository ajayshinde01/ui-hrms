import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Router, Data } from '@angular/router';
import { ColumnsMetadata } from '../../../models/columnMetaData';
import { Organization } from '../../../models/organization.model';
import { OrganizationService } from '../../../services/organization.service';
import { OrganizationFormComponent } from '../../forms/organization-form/organization-form.component';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss'],
})
export class OrganizationComponent {
  @Output() sendDataEvnt = new EventEmitter<number>();

  matDialogRef: MatDialogRef<OrganizationFormComponent>;

  organizationMetaData: {
    content: Array<Organization>;
    totalElements: number;
  } = {
    content: [],
    totalElements: 0,
  };
  organizationHeaders: { columnsMetadata: Array<ColumnsMetadata> } = {
    columnsMetadata: [],
  };
  params: HttpParams = new HttpParams();

  masterName: string = 'Organization';

  constructor(
    private organizationService: OrganizationService,
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
    this.organizationService.getOrganizationsHeaders().subscribe(
      (response: { columnsMetadata: Array<ColumnsMetadata> }) => {
        console.log('GET-HEADERS Request successful', response);
        this.organizationHeaders = response;
        console.log(this.organizationHeaders);
      },
      (error: any) => {
        console.error('GET Request failed', error);
      }
    );
  }

  action(event: Data) {
    let type: string = event['event'];
    let orgCode: string = event['data'].organizationCode;
    const queryParam = { orgCode: orgCode };

    switch (type) {
      case 'delete':
        this.organizationService
          .deleteOrganization(event['data'].organizationCode)
          .subscribe(
            (response: any) => {
              console.log('DELETE-ORG Request successful', response);

              this.organizationService.notify(
                'Organization deleted successfully'
              );

              this.searchFunction(this.params);

              const currentPage = Number(this.params.get('page'));

              if (
                this.organizationMetaData.content.length === 1 &&
                currentPage > 0
              ) {
                const newPage = currentPage - 1;

                this.params = this.params.set('page', newPage.toString());

                this.searchFunction(this.params);
              }
            },
            (error: any) => {
              console.error('DELETE-ORGANIZATION Request failed', error);
            }
          );

        break;

      case 'add':
        this.OpenModal();
        this.router.navigate(['/master/organization']);
        break;

      case 'edit':
        this.OpenModalForEdit(orgCode);
        this.router.navigate(['/master/organization'], {
          queryParams: queryParam,
        });
        break;
    }
  }

  searchFunction(params: HttpParams) {
    this.params = params;
    this.organizationService
      .search(params)
      .subscribe(
        (data: { content: Array<Organization>; totalElements: number }) => {
          this.organizationMetaData = data;
        }
      );
  }

  OpenModal() {
    this.matDialogRef = this.matDialog.open(OrganizationFormComponent, {
      disableClose: true,
    });

    this.matDialogRef.afterClosed().subscribe((res: any) => {
      this.searchFunction(this.params);
      if (res == true) {
      }
    });
  }

  OpenModalForEdit(data: string) {
    this.matDialogRef = this.matDialog.open(OrganizationFormComponent, {
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
