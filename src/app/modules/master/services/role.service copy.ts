import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from '../models/role.model';
import { ColumnsMetadata } from '../models/columnMetaData';
@Injectable({
  providedIn: 'root',
})
export class RoleService {
  constructor(private http: HttpClient) {}

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

  updateRole(data: Role): Observable<Array<Role>> {
    return this.http.put<Array<Role>>(
      'http://localhost:8080/employee/role/update',
      data
    );
  }

  deleteRole(roleId: string): Observable<string> {
    return this.http.delete<string>(
      'http://localhost:8080/employee/role/delete/' + roleId
    );
  }
}
