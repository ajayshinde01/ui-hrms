import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Department } from '../models/department.model';
import { ColumnsMetadata } from '../models/columnMetaData';
import { ApiResponse } from '../models/response';
import { IndividualConfig, ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  constructor(private http: HttpClient, private toastrService: ToastrService) {}

  private dataSubject = new BehaviorSubject<string>('');
  public data$ = this.dataSubject.asObservable();

  createDepartment(department: Department): Observable<Department> {
    return this.http.post<Department>(
      'http://192.168.1.16:7000/employee/departments/add-department',
      department
    );
  }

  getDepartments(): Observable<Array<Department>> {
    return this.http.get<Array<Department>>(
      'http://192.168.1.16:7000/employee/departments/allDepartments'
    );
  }

  getDepartmentHeaders(): Observable<{
    columnsMetadata: Array<ColumnsMetadata>;
  }> {
    return this.http.get<{ columnsMetadata: Array<ColumnsMetadata> }>(
      'http://192.168.1.16:7000/employee/data-table-metadata/department'
    );
  }

  searchDepartmentById(departmentId: string): Observable<Department> {
    return this.http.get<Department>(
      'http://192.168.1.16:7000/employee/departments/' + departmentId
    );
  }

  updateDepartment(departmentId: string): Observable<Department> {
    return this.http.put<Department>(
      'http://192.168.1.16:7000/employee/departments/update',
      departmentId
    );
  }

  deleteDepartment(departmentId: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      'http://192.168.1.16:7000/employee/departments/' +
        departmentId +
        '?updatedBy=Admin'
    );
  }
  search(
    params: HttpParams
  ): Observable<{ content: Array<Department>; totalElements: number }> {
    return this.http.get<{ content: Array<Department>; totalElements: number }>(
      'http://192.168.1.16:7000/employee/departments/search',
      {
        params: params,
      }
    );
  }
  notify(message: string) {
    const toastrConfig: Partial<IndividualConfig> = {
      timeOut: 2500,
    };
    this.toastrService.success(message, '', toastrConfig);
  }

  warn(message: string) {
    const toastrConfig: Partial<IndividualConfig> = {
      timeOut: 2500,
    };
    this.toastrService.warning(message, '', toastrConfig);
  }

  sendData(data: string) {
    this.dataSubject.next(data);
  }
}
