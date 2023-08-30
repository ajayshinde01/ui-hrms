import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ScopeFormComponent } from '../../forms/scope-form/scope-form.component';
import { ColumnsMetadata } from '../../../models/columns-metadata';
import { Scope } from '../../../models/scope.model';
import { HttpParams } from '@angular/common/http';
import { ScopeService } from '../../../services/scope.service';
import { Data, Router } from '@angular/router';
import { ApiResponse } from '../../../models/response';

@Component({
  selector: 'app-scope-table',
  templateUrl: './scope-table.component.html',
  styleUrls: ['./scope-table.component.scss'],
})
export class ScopeTableComponent {
  buttonVisible: Array<boolean> = [true, true, true];
  matDialogRef: MatDialogRef<ScopeFormComponent>;

  scopeHeaders: { columnsMetadata: Array<ColumnsMetadata> } = {
    columnsMetadata: [],
  };

  scopeMetaData: { content: Array<Scope>; totalElements: number } = {
    content: [],
    totalElements: 0,
  };
  masterName: string = 'Scope';

  params: HttpParams = new HttpParams();

  constructor(
    private scopeService: ScopeService,
    private router: Router,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getHeaders();
    this.params = this.params.set('page', 0);
    this.params = this.params.set('size', 10);
    this.searchFunction(this.params);
  }

  getHeaders() {
    this.scopeService.getScopeHeaders().subscribe(
      (response: { columnsMetadata: Array<ColumnsMetadata> }) => {
        this.scopeHeaders = response;
      },
      (error: any) => {
        console.error('GET Request failed', error);
      }
    );
  }

  searchFunction(params: HttpParams) {
    this.params = params;
    this.scopeService
      .search(params)
      .subscribe((data: { content: Array<Scope>; totalElements: number }) => {
        console.log(data.content);
        this.scopeMetaData = data;
      });
  }

  action(event: Data) {
    let type: string = event['event'];
    let id: string = event['data'].id;
    const queryParam = { id: id };
    switch (type) {
      case 'delete':
        this.scopeService.deleteScope(id).subscribe(
          (response: ApiResponse) => {
            this.scopeService.notify('Scope Deleted successfully..!');
            const currentPage = Number(this.params.get('page'));
            if (this.scopeMetaData.content.length === 1 && currentPage > 0) {
              const newPage = currentPage - 1;
              this.params = this.params.set('page', newPage.toString());
              this.searchFunction(this.params);
            }
            this.searchFunction(this.params);
          },
          (error: any) => {
            console.error('DELETE-Scope Request failed', error);
          }
        );
        break;

      case 'add':
        this.OpenModal();

        this.router.navigate(['/user/scope-table']);
        break;

      case 'edit':
        this.OpenModalForEdit(id);
        this.router.navigate(['/user/scope-table'], {
          queryParams: queryParam,
        });
        break;
    }
  }

  OpenModal() {
    this.matDialogRef = this.matDialog.open(ScopeFormComponent, {
      disableClose: true,
    });

    this.matDialogRef.afterClosed().subscribe((res: any) => {
      this.searchFunction(this.params);

      if (res == true) {
      }
    });
  }

  OpenModalForEdit(data: string) {
    this.matDialogRef = this.matDialog.open(ScopeFormComponent, {
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
