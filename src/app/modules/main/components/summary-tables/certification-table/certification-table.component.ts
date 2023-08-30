import { Component, EventEmitter, Output } from '@angular/core';
import { CertificationFormComponent } from '../../forms/certification-form/certification-form.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Certification } from '../../../models/certification.model';
import { ColumnsMetadata } from '../../../models/columns-metadata';
import { HttpParams } from '@angular/common/http';
import { CertificationService } from '../../../services/certification.service';
import { Router, Data, ActivatedRoute } from '@angular/router';
import { ApiResponse } from '../../../models/response';

@Component({
  selector: 'app-certification-table',
  templateUrl: './certification-table.component.html',
  styleUrls: ['./certification-table.component.scss'],
})
export class CertificationTableComponent {
  @Output() sendDataEvnt = new EventEmitter<number>();
  matDialogRef: MatDialogRef<CertificationFormComponent>;
  id: number;
  certificationsMetaData: {
    content: Array<Certification>;
    totalElements: number;
  } = {
    content: [],
    totalElements: 0,
  };
  certificationsHeaders: { columnsMetadata: Array<ColumnsMetadata> } = {
    columnsMetadata: [],
  };
  params: HttpParams = new HttpParams();
  buttonVisible: Array<boolean> = [true, true, true];

  constructor(
    private certificationService: CertificationService,
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
    this.certificationService.getCertificationsHeaders().subscribe(
      (response: { columnsMetadata: Array<ColumnsMetadata> }) => {
        this.certificationsHeaders = response;
      },
      (error: any) => {
        console.error('GET Request failed', error);
      }
    );
  }
  action(event: Data) {
    let type: string = event['event'];
    let id: string = event['data'].id;
    const queryParam = { certificationsId: id };
    switch (type) {
      case 'delete':
        this.certificationService
          .deleteCertifications(event['data'].id, this.id)
          .subscribe(
            (response: ApiResponse) => {
              console.log('DELETE-Certification Request successful', response);
              this.certificationService.notify(
                'Certification deleted successfully'
              );
              this.searchFunction(this.params);
              const currentPage = Number(this.params.get('page'));
              if (
                this.certificationsMetaData.content.length === 1 &&
                currentPage > 0
              ) {
                const newPage = currentPage - 1;
                this.params = this.params.set('page', newPage.toString());
                this.searchFunction(this.params);
              }
            },
            (error: any) => {
              console.error('DELETE-Certification Request failed', error);
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
    this.certificationService
      .search(params, this.id)
      .subscribe(
        (data: { content: Array<Certification>; totalElements: number }) => {
          console.log(data.content);
          console.log(data.totalElements);
          this.certificationsMetaData = data;
        }
      );
  }
  OpenModal() {
    this.matDialogRef = this.matDialog.open(CertificationFormComponent, {
      data: {
        certificationsId: this.id,
        id: this.id,
      },
      disableClose: true,
    });
    this.matDialogRef.afterClosed().subscribe((res: any) => {
      this.searchFunction(this.params);
      if (res == true) {
      }
    });
  }
  OpenModalForEdit(data: string, id: number) {
    debugger;
    this.matDialogRef = this.matDialog.open(CertificationFormComponent, {
      data: {
        certificationsId: data,
        id: id,
      },
      disableClose: true,
    });
    this.matDialogRef.afterClosed().subscribe((res: any) => {
      this.searchFunction(this.params);
      if (res == true) {
      }
    });
  }
}
