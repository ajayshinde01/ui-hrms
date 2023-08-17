import { Component, EventEmitter, Output } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
  MatDialogConfig,
} from '@angular/material/dialog';
import { Data, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { ApiResponse } from 'src/app/modules/master/models/response';
import { ColumnsMetadata } from '../../../models/columnMetaData';
import { Role } from '../../../models/role.model';
import { RoleService } from '../../../services/role.service';
import { RoleFormComponent } from '../../forms/role-form/role.form.component';

@Component({
  selector: 'app-role',
  templateUrl: './role.table.component.html',
  styleUrls: ['./role.table.component.scss'],
})
export class RoleComponent {
  @Output() sendDataEvnt = new EventEmitter<number>();

  matDialogRef: MatDialogRef<RoleFormComponent>;

  roleMetaData: { content: Array<Role>; totalElements: number } = {
    content: [],
    totalElements: 0,
  };
  roleHeaders: { columnsMetadata: Array<ColumnsMetadata> } = {
    columnsMetadata: [],
  };
  params: HttpParams = new HttpParams();

  constructor(
    private roleService: RoleService,
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
    this.roleService.getRolesHeaders().subscribe(
      (response: { columnsMetadata: Array<ColumnsMetadata> }) => {
        console.log('GET-HEADERS Request successful', response);
        this.roleHeaders = response;
        console.log(this.roleHeaders);
      },
      (error: any) => {
        console.error('GET Request failed', error);
      }
    );
  }

  action(event: Data) {
    let type: string = event['event'];
    let id: string = event['data'].roleId;
    const queryParam = { id: id };

    switch (type) {
      case 'delete':
        this.roleService.deleteRole(event['data'].roleId).subscribe(
          (response: ApiResponse) => {
            console.log('DELETE-ROLE Request successful', response);

            this.roleService.notify('Role Deleted successfully');
            console.log(this.params);

            this.searchFunction(this.params);

            const currentPage = Number(this.params.get('page'));

            if (this.roleMetaData.content.length === 1 && currentPage > 0) {
              const newPage = currentPage - 1;

              this.params = this.params.set('page', newPage.toString());

              this.searchFunction(this.params);
            }
          },
          (error: any) => {
            console.error('DELETE-ROLE Request failed', error);
          }
        );

        break;

      case 'add':
        this.OpenModal();
        this.router.navigate(['/master/role']);
        break;

      case 'edit':
        this.OpenModalForEdit(id);
        this.router.navigate(['/master/role'], { queryParams: queryParam });
        break;
    }
  }

  searchFunction(params: HttpParams) {
    this.params = params;
    this.roleService
      .search(params)
      .subscribe((data: { content: Array<Role>; totalElements: number }) => {
        console.log(data.content);
        console.log(data.totalElements);
        this.roleMetaData = data;
      });
  }

  OpenModal() {
    this.matDialogRef = this.matDialog.open(RoleFormComponent, {
      disableClose: true,
    });

    this.matDialogRef.afterClosed().subscribe((res: any) => {
      if (res == true) {
      }
    });
  }

  OpenModalForEdit(data: string) {
    this.matDialogRef = this.matDialog.open(RoleFormComponent, {
      data: { id: data },
      disableClose: true,
    });

    this.matDialogRef.afterClosed().subscribe((res: any) => {
      if (res == true) {
      }
    });
  }
}
