import { Component, EventEmitter, Output } from '@angular/core';

import { Data, Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { ApiResponse } from 'src/app/modules/master/models/response';
import { ColumnsMetadata } from '../../../models/columnMetaData';
import { Role } from '../../../models/role.model';
import { RoleService } from '../../../services/role.service';
import { PopupComponent } from '../../helper/popup/popup.component';

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
        //const dataToSend = id;
        //this.roleService.sendData(dataToSend);

        // const dialogConfig = new MatDialogConfig();
        // dialogConfig.disableClose = true;
        // dialogConfig.autoFocus = true;
        // dialogConfig.width = '60%';
        // this.dialog.open(PopupComponent);
        //this.roleService.sendData(id);
        //this.openPopup('Are ou sure want to delete ?', id);
        // this.roleService.deleteRole(event['data'].roleId).subscribe(
        //   (response: ApiResponse) => {
        //     console.log('DELETE-ROLE Request successful', response);

        //     this.openPopup('Role Deleted successfully..');
        //     this.router.navigate(['/master/role']);
        //   },
        //   (error: any) => {
        //     console.error('DELETE-ROLE Request failed', error);
        //   }
        // );
        //this.roleService.notify('Role Deleted successfully..!');
        this.roleService.deleteRole(event['data'].roleId).subscribe(
          (response: ApiResponse) => {
            console.log('DELETE-ROLE Request successful', response);

            this.roleService.notify('Role Deleted successfully..!');
            let params = new HttpParams();
            params = params.set('page', 0);
            params = params.set('size', 10);
            this.searchFunction(params);
          },
          (error: any) => {
            console.error('DELETE-ROLE Request failed', error);
          }
        );

        break;

      case 'add':
        this.router.navigate(['/master/roleForm']);
        break;

      case 'edit':
        if (event['data'].roleId == undefined)
          this.roleService.warn('Please select Id for the operation');
        this.router.navigate(['/master/roleForm'], { queryParams: queryParam });
        break;
    }
  }

  openPopup(message: string) {
    this.dialog.open(PopupComponent, {
      width: '600px',
      height: '200px',
      data: { message: message },
    });
  }

  searchFunction(event: HttpParams) {
    this.roleService
      .search(event)
      .subscribe((data: { content: Array<Role>; totalElements: number }) => {
        console.log(data.content);
        console.log(data.totalElements);
        this.roleMetaData = data;
      });
  }
}
