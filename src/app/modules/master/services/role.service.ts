import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Role } from '../models/role.model';
import { ColumnsMetadata } from '../models/columnMetaData';
import { ApiResponse } from '../models/response';
import { ToastrService } from 'ngx-toastr';
import { Data } from '@angular/router';

@Injectable()
export class RoleService {
  constructor(private http: HttpClient, private toastrService: ToastrService) {}
  private dataSubject = new BehaviorSubject<string>('');
  public data$ = this.dataSubject.asObservable();

  ngOnInit(): void {}

  getRoles(): Observable<Array<Role>> {
    return this.http.get<Array<Role>>(
      'http://localhost:8080/employee/role/all-roles'
    );
  }

  getRolesHeaders(): Observable<{ columnsMetadata: Array<ColumnsMetadata> }> {
    return this.http.get<{ columnsMetadata: Array<ColumnsMetadata> }>(
      'http://localhost:8080/data-table-metadata/role'
    );
  }

  createRole(data: Role): Observable<Array<Role>> {
    console.log('in create service', data);

    return this.http.post<Array<Role>>(
      'http://localhost:8080/employee/role/create',
      data
    );
  }

  searchRoleById(id: string): Observable<Role> {
    return this.http.get<Role>(
      'http://localhost:8080/employee/role/search/' + id
    );
  }

  updateRole(data: Role): Observable<Array<Role>> {
    console.log(data);
    return this.http.put<Array<Role>>(
      'http://localhost:8080/employee/role/update',
      data
    );
  }

  deleteRole(roleId: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      'http://localhost:8080/employee/role/delete/' + roleId
    );
  }

  search(
    params: HttpParams
  ): Observable<{ content: Array<Role>; totalElements: number }> {
    return this.http.get<{ content: Array<Role>; totalElements: number }>(
      'http://localhost:8080/employee/role/search',
      {
        params: params,
      }
    );
  }

  notify(message: string) {
    this.toastrService.success(message, 'Role Master');
  }

  warn(message: string) {
    this.toastrService.warning(message);
  }

  sendData(data: string) {
    console.log(data);
    this.dataSubject.next(data);
  }
}
