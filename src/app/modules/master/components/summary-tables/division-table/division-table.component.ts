import { Component, EventEmitter, Output } from '@angular/core';
import { Division } from '../../../models/division.model';
import { ColumnsMetadata } from '../../../models/columnMetaData';
import { DivisionService } from '../../../services/division.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Data, Router } from '@angular/router';
import { PopupComponent } from '../../helper/popup/popup.component';
import { ApiResponse } from '../../../models/response';
import { HttpParams } from '@angular/common/http';
import { DivisionComponent } from '../../forms/division-form/division.component';

@Component({
  selector: 'app-division-table',
  templateUrl: './division-table.component.html',
  styleUrls: ['./division-table.component.scss'],
})
export class DivisionTableComponent {
  @Output() sendDataEvnt = new EventEmitter<number>();
  matDialogRef: MatDialogRef<DivisionComponent>;
  divisionMetaData: { content: Array<Division>; totalElements: number } = {
    content: [],
    totalElements: 0,
  };
  divisionHeaders: { columnsMetadata: Array<ColumnsMetadata> } = {
    columnsMetadata: [],
  };

  params: HttpParams = new HttpParams();
  constructor(
    private divisionService: DivisionService,
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
    this.divisionService.getDivisionHeaders().subscribe(
      (response: { columnsMetadata: Array<ColumnsMetadata> }) => {
        this.divisionHeaders = response;
        console.log(this.divisionHeaders);
      },
      (error: any) => {
        console.error('GET Request failed', error);
      }
    );
  }
  action(event: Data) {
    let type: string = event['event'];
    let id: string = event['data'].divisionId;
    const queryParam = { id: id };
    switch (type) {
      case 'delete':
        this.divisionService.deleteDivision(event['data'].divisionId).subscribe(
          (response: ApiResponse) => {
            console.log('DELETE-Division Request successful', response);

            this.divisionService.notify('Division Deleted successfully..!');
            const currentPage = Number(this.params.get('page'));

            if (this.divisionMetaData.content.length === 1 && currentPage > 0) {
              const newPage = currentPage - 1;

              this.params = this.params.set('page', newPage.toString());

              this.searchFunction(this.params);
            }
            this.searchFunction(this.params);
          },
          (error: any) => {
            console.error('DELETE-Division Request failed', error);
          }
        );
        break;
      case 'add':
        this.OpenModal();
        //this.router.navigate(['/master/division']);
        break;

      case 'edit':
        this.OpenModalForEdit(id);
        this.router.navigate(['/master/division'], { queryParams: queryParam });
        break;
    }
  }

  searchFunction(params: HttpParams) {
    this.params = params;
    this.divisionService
      .search(params)
      .subscribe(
        (data: { content: Array<Division>; totalElements: number }) => {
          console.log(data.content);
          console.log(data.totalElements);
          this.divisionMetaData = data;
        }
      );
  }

  OpenModal() {
    this.matDialogRef = this.matDialog.open(DivisionComponent, {
      disableClose: true,
    });

    this.matDialogRef.afterClosed().subscribe((res: any) => {
      if (res == true) {
      }
    });
  }
  OpenModalForEdit(data: string) {
    this.matDialogRef = this.matDialog.open(DivisionComponent, {
      data: { id: data },
      disableClose: true,
    });

    this.matDialogRef.afterClosed().subscribe((res: any) => {
      if (res == true) {
      }
    });
  }
}
