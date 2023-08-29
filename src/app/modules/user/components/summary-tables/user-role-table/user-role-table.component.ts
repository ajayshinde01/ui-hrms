import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserRoleFormComponent } from '../../forms/user-role-form/user-role-form.component';
import { ColumnsMetadata } from '../../../models/columns-metadata';
import { UserRole } from '../../../models/user-role.model';
import { HttpParams } from '@angular/common/http';
import { UserRoleService } from '../../../services/user-role.service';
import { Data, Router } from '@angular/router';
import { ApiResponse } from '../../../models/response';

@Component({
  selector: 'app-user-role-table',
  templateUrl: './user-role-table.component.html',
  styleUrls: ['./user-role-table.component.scss'],
})
export class UserRoleTableComponent {
  matDialogRef: MatDialogRef<UserRoleFormComponent>;

  roleHeaders: { columnsMetadata: Array<ColumnsMetadata> } = {
    columnsMetadata: [],
  };
  roleMetaData: { content: Array<UserRole>; totalElements: number } = {
    content: [],
    totalElements: 0,
  };
  masterName: string = 'Role';

  params: HttpParams = new HttpParams();

  constructor(
    private userRoleService: UserRoleService,
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
    this.userRoleService.getRoleHeaders().subscribe(
      (response: { columnsMetadata: Array<ColumnsMetadata> }) => {
        this.roleHeaders = response;
      },
      (error: any) => {
        console.error('GET Request failed', error);
      }
    );
  }

  searchFunction(params: HttpParams) {
    this.params = params;
    this.userRoleService
      .search(params)
      .subscribe(
        (data: { content: Array<UserRole>; totalElements: number }) => {
          console.log(data.content);
          this.roleMetaData = data;
        }
      );
  }

  action(event: Data) {
    let type: string = event['event'];
    let id: string = event['data'].id;
    const queryParam = { id: id };
    switch (type) {
      case 'delete':
        this.userRoleService.deleteRole(id).subscribe(
          (response: ApiResponse) => {
            this.userRoleService.notify('Role Deleted successfully..!');
            const currentPage = Number(this.params.get('page'));
            if (this.roleMetaData.content.length === 1 && currentPage > 0) {
              const newPage = currentPage - 1;
              this.params = this.params.set('page', newPage.toString());
              this.searchFunction(this.params);
            }
            this.searchFunction(this.params);
          },
          (error: any) => {
            console.error('DELETE-Role Request failed', error);
          }
        );
        break;

      case 'add':
        this.OpenModal();
        this.router.navigate(['/user/user-role-table']);
        break;

      case 'edit':
        this.OpenModalForEdit(id);
        this.router.navigate(['/user/user-role-table'], {
          queryParams: queryParam,
        });
        break;
    }
  }

  OpenModal() {
    this.matDialogRef = this.matDialog.open(UserRoleFormComponent, {
      disableClose: true,
    });

    this.matDialogRef.afterClosed().subscribe((res: any) => {
      this.searchFunction(this.params);

      if (res == true) {
      }
    });
  }

  OpenModalForEdit(data: string) {
    this.matDialogRef = this.matDialog.open(UserRoleFormComponent, {
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
