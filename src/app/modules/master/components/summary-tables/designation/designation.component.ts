import { Component, EventEmitter, Output } from '@angular/core';
import { Designation } from 'src/app/modules/master/models/designation.model';
import { ColumnsMetadata } from 'src/app/modules/master/models/columnMetaData';
import { DesignationService } from 'src/app/modules/master/services/designation.service';
import { Data, Router } from '@angular/router';
import { ApiResponse } from 'src/app/modules/master/models/response';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpParams } from '@angular/common/http';
import { PopupComponent } from '../../helper/popup/popup.component';
import { DesignationFormComponent } from '../../forms/designation-form/designation.form.component';

@Component({
  selector: 'app-designation',
  templateUrl: './designation.component.html',
  styleUrls: ['./designation.component.scss'],
})
export class DesignationComponent {
  @Output() sendDataEvnt = new EventEmitter<number>();
  buttonVisible: Array<boolean> = [true, true, true];
  matDialogRef: MatDialogRef<DesignationFormComponent>;

  designationMetaData: { content: Array<Designation>; totalElements: number } =
    {
      content: [],
      totalElements: 0,
    };
  designationHeaders: { columnsMetadata: Array<ColumnsMetadata> } = {
    columnsMetadata: [],
  };

  params: HttpParams = new HttpParams();

  masterName: string = 'Designation';

  constructor(
    private designationService: DesignationService,
    private router: Router,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getHeaders();
    let params = new HttpParams();
    params = params.set('page', 0);
    params = params.set('size', 10);
    this.searchFunction(params);
    console.log('inside ngonit of table');
  }

  getHeaders() {
    this.designationService.getDesignationHeaders().subscribe(
      (response: { columnsMetadata: Array<ColumnsMetadata> }) => {
        console.log('GET-HEADERS Request successful', response);
        this.designationHeaders = response;
        console.log(this.designationHeaders);
      },
      (error: any) => {
        console.error('GET Request failed', error);
      }
    );
  }

  action(event: Data) {
    let type: string = event['event'];
    let id: string = event['data'].designationId;

    const queryParam = { id: id };
    switch (type) {
      case 'delete':
        this.designationService
          .deleteDesignation(event['data'].designationId)
          .subscribe(
            (response: ApiResponse) => {
              console.log('DELETE-DESIGNATION Request successful', response);
              this.designationService.notify(
                'Designation deleted successfully'
              );
              this.searchFunction(this.params);

              const currentPage = Number(this.params.get('page'));

              if (
                this.designationMetaData.content.length === 1 &&
                currentPage > 0
              ) {
                const newPage = currentPage - 1;

                this.params = this.params.set('page', newPage.toString());

                this.searchFunction(this.params);
              }
            },
            (error: any) => {
              console.error('DELETE-DESIGNATION Request failed', error);
            }
          );
        break;

      case 'add':
        this.OpenModal();
        this.router.navigate(['/master/designation']);
        break;

      case 'edit':
        data: {
          id: queryParam;
        }
        this.OpenModalForEdit(id);

        this.router.navigate(['/master/designation'], {
          queryParams: queryParam,
        });

        break;
    }
  }

  searchFunction(params: HttpParams) {
    this.params = params;
    this.designationService
      .search(params)
      .subscribe(
        (data: { content: Array<Designation>; totalElements: number }) => {
          console.log(data.content);
          console.log(data.totalElements);
          this.designationMetaData = data;
        }
      );
  }

  OpenModal() {
    this.matDialogRef = this.matDialog.open(DesignationFormComponent, {
      disableClose: true,
    });

    this.matDialogRef.afterClosed().subscribe((res: any) => {
      this.searchFunction(this.params);

      if (res == true) {
      }
    });
  }
  OpenModalForEdit(data: string) {
    this.matDialogRef = this.matDialog.open(DesignationFormComponent, {
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
