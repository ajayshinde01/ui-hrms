import { User } from './../../../models/user.model';
import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { ColumnsMetadata } from '../../../models/columns-metadata';
import { HttpParams } from '@angular/common/http';
import { UserService } from '../../../services/user.service';
import { Data, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiResponse } from '../../../models/response';
import { UserFormComponent } from '../../forms/user-form/user-form.component';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss'],
})
export class UserTableComponent implements OnInit {
  @Output() sendDataEvnt = new EventEmitter<number>();
  matDialogRef: MatDialogRef<UserFormComponent>;

  userHeaders: { columnsMetadata: Array<ColumnsMetadata> } = {
    columnsMetadata: [],
  };
  userMetaData: { content: Array<User>; totalElements: number } = {
    content: [],
    totalElements: 0,
  };
  masterName: string = 'User';

  params: HttpParams = new HttpParams();

  constructor(
    private userService: UserService,
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
    this.userService.getUserHeaders().subscribe(
      (response: { columnsMetadata: Array<ColumnsMetadata> }) => {
        this.userHeaders = response;
      },
      (error: any) => {
        console.error('GET Request failed', error);
      }
    );
  }

  searchFunction(params: HttpParams) {
    this.params = params;
    this.userService
      .search(params)
      .subscribe((data: { content: Array<User>; totalElements: number }) => {
        console.log(data.content);
        this.userMetaData = data;
      });
  }

  action(event: Data) {
    let type: string = event['event'];
    let id: string = event['data'].id;
    const queryParam = { id: id };
    switch (type) {
      case 'delete':
        this.userService.deleteUser(id).subscribe(
          (response: ApiResponse) => {
            this.userService.notify('User Deleted successfully..!');
            const currentPage = Number(this.params.get('page'));
            if (this.userMetaData.content.length === 1 && currentPage > 0) {
              const newPage = currentPage - 1;
              this.params = this.params.set('page', newPage.toString());
              this.searchFunction(this.params);
            }
            this.searchFunction(this.params);
          },
          (error: any) => {
            console.error('DELETE-User Request failed', error);
          }
        );
        break;

      case 'add':
        this.OpenModal();

        this.router.navigate(['/user/user-table']);
        break;

      case 'edit':
        this.OpenModalForEdit(id);
        this.router.navigate(['/user/user-table'], {
          queryParams: queryParam,
        });
        break;
    }
  }

  OpenModal() {
    this.matDialogRef = this.matDialog.open(UserFormComponent, {
      disableClose: true,
    });

    this.matDialogRef.afterClosed().subscribe((res: any) => {
      this.searchFunction(this.params);

      if (res == true) {
      }
    });
  }

  OpenModalForEdit(data: string) {
    this.matDialogRef = this.matDialog.open(UserFormComponent, {
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
