import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Data, Router } from '@angular/router';
import { ColumnsMetadata } from 'src/app/modules/master/models/columnMetaData';
import { Grade } from 'src/app/modules/master/models/grade.model';
import { ApiResponse } from 'src/app/modules/master/models/response';
import { GradeService } from 'src/app/modules/master/services/grade.service';
import { PopupComponent } from '../../helper/popup/popup.component';
import { GradeFormComponent } from '../../forms/grade-form/grade.form.component';

@Component({
  selector: 'app-grade',
  templateUrl: './grade.component.html',
  styleUrls: ['./grade.component.scss'],
})
export class GradeComponent {
  @Output() sendDataEvnt = new EventEmitter<number>();
  buttonVisible: Array<boolean> = [true, true, true];
  matDialogRef: MatDialogRef<GradeFormComponent>;
  gradeMetaData: { content: Array<Grade>; totalElements: number } = {
    content: [],
    totalElements: 0,
  };
  gradesHeaders: { columnsMetadata: Array<ColumnsMetadata> } = {
    columnsMetadata: [],
  };
  params: HttpParams = new HttpParams();

  masterName: string = 'Grade';

  constructor(
    private gradeService: GradeService,
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
            this.searchFunction(this.params);

            const currentPage = Number(this.params.get('page'));

            if (this.gradeMetaData.content.length === 1 && currentPage > 0) {
              const newPage = currentPage - 1;

              this.params = this.params.set('page', newPage.toString());

              this.searchFunction(this.params);
            }

            this.gradeService.notify('Grade deleted successfully');
          },
          (error: any) => {
            console.error('DELETE-GRADE Request failed', error);
          }
        );
        break;

      case 'add':
        this.OpenModal();
        this.router.navigate(['/master/grade']);
        break;

      case 'edit':
        this.OpenModalForEdit(id);
        this.router.navigate(['/master/grade'], {
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

  OpenModal() {
    this.matDialogRef = this.matDialog.open(GradeFormComponent, {
      disableClose: true,
    });

    this.matDialogRef.afterClosed().subscribe((res: any) => {
      this.searchFunction(this.params);

      if (res == true) {
      }
    });
  }

  OpenModalForEdit(data: string) {
    this.matDialogRef = this.matDialog.open(GradeFormComponent, {
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
