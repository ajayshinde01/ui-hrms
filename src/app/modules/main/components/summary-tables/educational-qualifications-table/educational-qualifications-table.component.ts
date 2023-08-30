import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Router, Data, ActivatedRoute } from '@angular/router';
import { EmployeeTypeComponent } from 'src/app/modules/master/components/forms/employee-type-form/employee-type.component';
import { Employee } from 'src/app/modules/master/models/employee.model';
import { EmployeeTypeService } from 'src/app/modules/master/services/employee-type.service';
import { ColumnsMetadata } from '../../../models/columns-metadata';
import { ApiResponse } from '../../../models/response';
import { EducationalQualification } from '../../../models/educational-qualification.model';
import { EducationalQualificationService } from '../../../services/educational-qualification.service';
import { EducationalQualificationFormComponent } from '../../forms/educational-qualification-form/educational-qualification-form.component';

@Component({
  selector: 'app-educational-qualifications-table',
  templateUrl: './educational-qualifications-table.component.html',
  styleUrls: ['./educational-qualifications-table.component.scss'],
})
export class EducationalQualificationsTableComponent implements OnInit {
  @Output() sendDataEvnt = new EventEmitter<number>();
  matDialogRef: MatDialogRef<EducationalQualificationFormComponent>;
  id: number;
  educationalQualificationsMetaData: {
    content: Array<EducationalQualification>;
    totalElements: number;
  } = {
    content: [],
    totalElements: 0,
  };
  educationalQualificationHeaders: { columnsMetadata: Array<ColumnsMetadata> } =
    {
      columnsMetadata: [],
    };
  params: HttpParams = new HttpParams();
  constructor(
    private educationalQualificationService: EducationalQualificationService,
    private router: Router,
    private matDialog: MatDialog,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.id = params['id'];
    });
    this.getHeaders();
    let params = new HttpParams();
    params = params.set('page', 0);
    params = params.set('size', 10);
    this.searchFunction(params);
  }
  getHeaders() {
    this.educationalQualificationService
      .getEducationalQualificationHeaders()
      .subscribe(
        (response: { columnsMetadata: Array<ColumnsMetadata> }) => {
          this.educationalQualificationHeaders = response;
        },
        (error: any) => {
          console.error('GET Request failed', error);
        }
      );
  }
  action(event: Data) {
    let type: string = event['event'];
    let id: string = event['data'].id;
    const queryParam = { educationalQualificationId: id };
    switch (type) {
      case 'delete':
        this.educationalQualificationService
          .deleteEducationalQualification(event['data'].id, this.id)
          .subscribe(
            (response: ApiResponse) => {
              console.log(
                'DELETE-Educational Qualification Request successful',
                response
              );
              this.educationalQualificationService.notify(
                'Educational Qualification deleted successfully'
              );
              this.searchFunction(this.params);
              const currentPage = Number(this.params.get('page'));
              if (
                this.educationalQualificationsMetaData.content.length === 1 &&
                currentPage > 0
              ) {
                const newPage = currentPage - 1;
                this.params = this.params.set('page', newPage.toString());
                this.searchFunction(this.params);
              }
            },
            (error: any) => {
              console.error(
                'DELETE-Eucational Quaification Request failed',
                error
              );
            }
          );
        break;
      case 'add':
        this.OpenModal();
        // this.router.navigate(['/main/educational-qualification']);
        break;
      case 'edit':
        this.OpenModalForEdit(id, this.id);
        break;
    }
  }
  searchFunction(params: HttpParams) {
    this.params = params;
    this.educationalQualificationService
      .search(params, this.id)
      .subscribe(
        (data: {
          content: Array<EducationalQualification>;
          totalElements: number;
        }) => {
          console.log(data.content);
          console.log(data.totalElements);
          this.educationalQualificationsMetaData = data;
        }
      );
  }
  OpenModal() {
    this.matDialogRef = this.matDialog.open(
      EducationalQualificationFormComponent,
      {
        data: {
          educationalQualificationId: this.id,
          id: this.id,
        },
        disableClose: true,
      }
    );
    this.matDialogRef.afterClosed().subscribe((res: any) => {
      this.searchFunction(this.params);
      if (res == true) {
      }
    });
  }
  OpenModalForEdit(data: string, id: number) {
    this.matDialogRef = this.matDialog.open(
      EducationalQualificationFormComponent,
      {
        data: {
          educationalQualificationId: data,
          id: id,
        },
        disableClose: true,
      }
    );
    this.matDialogRef.afterClosed().subscribe((res: any) => {
      this.searchFunction(this.params);
      if (res == true) {
      }
    });
  }
}
