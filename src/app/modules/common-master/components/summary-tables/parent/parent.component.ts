import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, Data } from '@angular/router';
import { ColumnsMetadata } from 'src/app/modules/master/models/columnMetaData';
import { Parent } from '../../../models/parent';
import { ParentService } from '../../../services/parent.service';
import { ApiResponse } from '../../../models/response';

@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.scss'],
})
export class ParentComponent {
  @Output() sendDataEvnt = new EventEmitter<number>();

  parentMetaData: { content: Array<Parent>; totalElements: number } = {
    content: [],
    totalElements: 0,
  };
  parentHeaders: { columnsMetadata: Array<ColumnsMetadata> } = {
    columnsMetadata: [],
  };
  params: HttpParams = new HttpParams();

  masterName: string = 'COMMON MASTER';

  constructor(
    private parentService: ParentService,
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
    this.parentService.getParentsHeaders().subscribe(
      (response: { columnsMetadata: Array<ColumnsMetadata> }) => {
        console.log('GET-HEADERS Request successful', response);
        this.parentHeaders = response;
        console.log(this.parentHeaders);
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
      case 'delete':
        console.log('inside parent data table delete');
        this.parentService.deleteParent(event['data'].id).subscribe(
          (response: ApiResponse) => {
            console.log('DELETE-PARENT Request successful', response);

            this.parentService.notify('Parent deleted successfully');

            this.searchFunction(this.params);

            const currentPage = Number(this.params.get('page'));

            if (this.parentMetaData.content.length === 1 && currentPage > 0) {
              const newPage = currentPage - 1;

              this.params = this.params.set('page', newPage.toString());

              this.searchFunction(this.params);
            }
          },
          (error: any) => {
            console.error('DELETE-PARENT Request failed', error);
          }
        );

        break;

      case 'add':
        this.router.navigate(['/common-master/parentForm']);
        break;

      case 'edit':
        this.router.navigate(['/common-master/parentForm'], {
          queryParams: queryParam,
        });
        break;
    }
  }

  searchFunction(params: HttpParams) {
    this.params = params;
    this.parentService
      .search(params)
      .subscribe((data: { content: Array<Parent>; totalElements: number }) => {
        this.parentMetaData = data;
      });
  }

  //   OpenModal() {
  //     this.matDialogRef = this.matDialog.open(RoleFormComponent, {
  //       disableClose: true,
  //     });

  //     this.matDialogRef.afterClosed().subscribe((res: any) => {
  //       this.searchFunction(this.params);
  //       if (res == true) {
  //       }
  //     });
  //   }

  //   OpenModalForEdit(data: string) {
  //     this.matDialogRef = this.matDialog.open(RoleFormComponent, {
  //       data: { id: data },
  //       disableClose: true,
  //     });

  //     this.matDialogRef.afterClosed().subscribe((res: any) => {
  //       this.searchFunction(this.params);
  //       if (res == true) {
  //       }
  //     });
  //   }
  // }
}
