import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from '../models/role.model';
import { ColumnsMetadata } from '../models/columnMetaData';
import { ApiResponse } from '../models/response';


@Injectable()
export class RoleService {
  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  getRoles(): Observable<Array<Role>> {
    return this.http.get<Array<Role>>(
      'http://localhost:8090/employee/employee/role/all-roles'
    );
  }

  getRolesHeaders(): Observable<{ columnsMetadata: Array<ColumnsMetadata> }> {
    return this.http.get<{ columnsMetadata: Array<ColumnsMetadata> }>(
      'http://localhost:8090/employee/data-table-metadata/role'
    );
  }

  createRole(data: Role): Observable<Array<Role>> {
    console.log('in create service', data);

    return this.http.post<Array<Role>>(
      'http://localhost:8090/employee/employee/role/create',
      data
    );
  }

  searchRoleById(id: string): Observable<Role> {
    return this.http.get<Role>(
      '' + id
    );
  }
  // updateRole(data: Role): Observable<Array<Role>> {
  //   return this.http.put<Array<Role>>(
  //     'http://localhost:8090/employee/employee/role/update',
  //     data
  //   );
  // }
  updateRole(data: Role): Observable<Array<Role>> {
    return this.http.put<Array<Role>>(
      'http://localhost:8090/employee/employee/role/update',
      data
    );
  }

  deleteRole(roleId: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      'http://localhost:8090/employee/employee/role/delete/' + roleId
    );
  }
  search(
    params: HttpParams
  ): Observable<{ content: Array<Role>; totalElements: number }> {
    return this.http.get<{ content: Array<Role>; totalElements: number }>(
      'http://localhost:8090/employee/employee/role/search',
      {
        params: params,
      }
    );
}
}