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

            this.roleService.notify('Role Deleted successfully..!');
            console.log(this.params);
            this.searchFunction(this.params);
          },
          (error: any) => {
            console.error('DELETE-ROLE Request failed', error);
          }
        );

        break;

      case 'add':
        // this.onAdd();
        this.router.navigate(['/master/roleForm']);
        break;

      case 'edit':
        this.router.navigate(['/master/roleForm'], { queryParams: queryParam });
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

  onAdd() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    this.dialog.open(RoleFormComponent, dialogConfig);
  }
}
