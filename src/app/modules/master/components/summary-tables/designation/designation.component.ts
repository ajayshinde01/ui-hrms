import { Component, EventEmitter, Output } from '@angular/core';
import { Designation } from 'src/app/modules/master/models/designation.model';
import { ColumnsMetadata } from 'src/app/modules/master/models/columnMetaData';
import { DesignationService } from 'src/app/modules/master/services/designation.service';
import { Data, Router } from '@angular/router';
import { ApiResponse } from 'src/app/modules/master/models/response';
import { MatDialog } from '@angular/material/dialog';
import { HttpParams } from '@angular/common/http';
import { PopupComponent } from '../../helper/popup/popup.component';

@Component({
  selector: 'app-designation',
  templateUrl: './designation.component.html',
  styleUrls: ['./designation.component.scss'],
})
export class DesignationComponent {
  @Output() sendDataEvnt = new EventEmitter<number>();

  designationMetaData: { content: Array<Designation>; totalElements: number } =
    {
      content: [],
      totalElements: 0,
    };
  designationHeaders: { columnsMetadata: Array<ColumnsMetadata> } = {
    columnsMetadata: [],
  };

  constructor(
    private designationService: DesignationService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getHeaders();
    let params = new HttpParams();
    params = params.set('page', 0);
    params = params.set('size', 10);
    this.searchFunction(params);
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

              let params = new HttpParams();
              params = params.set('page', 0);
              params = params.set('size', 10);
              this.searchFunction(params);
              this.designationService.notify(
                'Designation Deleted successfully..!'
              );
            },
            (error: any) => {
              console.error('DELETE-DESIGNATION Request failed', error);
            }
          );
        break;

      case 'add':
        this.router.navigate(['/master/designationForm']);
        break;

      case 'edit':
        this.router.navigate(['/master/designationForm'], {
          queryParams: queryParam,
        });
        console.log(queryParam);
        break;
    }
  }

  openPopup(message: string) {
    this.dialog.open(PopupComponent, {
      width: '600px',
      height: '200px',
      data: { message: message },
    });
  }

  searchFunction(event: HttpParams) {
    console.log('hi search ');
    this.designationService
      .search(event)
      .subscribe(
        (data: { content: Array<Designation>; totalElements: number }) => {
          console.log(data.content);
          console.log(data.totalElements);
          this.designationMetaData = data;
        }
      );
  }
}
