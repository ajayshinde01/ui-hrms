import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Data, Router } from '@angular/router';
import { ColumnsMetadata } from 'src/app/modules/master/models/columnMetaData';
import { Grade } from 'src/app/modules/master/models/grade.model';
import { ApiResponse } from 'src/app/modules/master/models/response';
import { GradeService } from 'src/app/modules/master/services/grade.service';
import { PopupComponent } from '../../helper/popup/popup.component';

@Component({
  selector: 'app-grade',
  templateUrl: './grade.component.html',
  styleUrls: ['./grade.component.scss'],
})
export class GradeComponent {
  @Output() sendDataEvnt = new EventEmitter<number>();

  gradeMetaData: { content: Array<Grade>; totalElements: number } = {
    content: [],
    totalElements: 0,
  };
  gradesHeaders: { columnsMetadata: Array<ColumnsMetadata> } = {
    columnsMetadata: [],
  };
  params: HttpParams = new HttpParams();

  constructor(
    private gradeService: GradeService,
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
    this.gradeService.getGradesHeaders().subscribe(
      (response: { columnsMetadata: Array<ColumnsMetadata> }) => {
        console.log('GET-HEADERS Request successful', response);
        this.gradesHeaders = response;
        console.log(this.gradesHeaders);
      },
      (error: any) => {
        console.error('GET Request failed', error);
      }
    );
  }

  action(event: Data) {
    let type: string = event['event'];
    let id: string = event['data'].gradeId;

    const queryParam = { id: id };

    switch (type) {
      case 'delete':
        this.gradeService.deleteGrade(event['data'].gradeId).subscribe(
          (response: ApiResponse) => {
            console.log('DELETE-Grade Request successful', response);
            const currentPage = Number(this.params.get('page'));

            if (this.gradeMetaData.content.length === 1 && currentPage > 0) {
              const newPage = currentPage - 1;

              this.params = this.params.set('page', newPage.toString());

              this.searchFunction(this.params);
            }

            this.searchFunction(this.params);

            this.gradeService.notify('Grade Deleted successfully..!');
          },
          (error: any) => {
            console.error('DELETE-GRADE Request failed', error);
          }
        );
        break;

      case 'add':
        this.router.navigate(['/master/gradeForm']);
        break;

      case 'edit':
        this.router.navigate(['/master/gradeForm'], {
          queryParams: queryParam,
        });
        break;
    }
  }

  searchFunction(params: HttpParams) {
    this.params = params;
    this.gradeService
      .search(params)
      .subscribe((data: { content: Array<Grade>; totalElements: number }) => {
        console.log(data.content);
        console.log(data.totalElements);
        this.gradeMetaData = data;
      });
  }
}
