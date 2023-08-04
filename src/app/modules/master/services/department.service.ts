import { Injectable } from '@angular/core';
import{HttpClient, HttpParams} from '@angular/common/http'
import { BehaviorSubject, Observable } from 'rxjs';
import { Department } from '../models/department.model';
import { ColumnsMetadata } from '../models/columnMetaData';
import { ApiResponse } from '../models/response';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private http: HttpClient,private toastrService: ToastrService) { } 

  private dataSubject = new BehaviorSubject<string>('');
  public data$ = this.dataSubject.asObservable();

  createDepartment(department: Department):Observable<Department> {
    return this.http.post<Department>('http://localhost:8090/employee/employee/departments/add-department', department);
  }

  getDepartments(): Observable<Array<Department>> {
    return this.http.get<Array<Department>>(
      'http://localhost:8090/employee/employee/departments/allDepartments'
    );
  }

  getDepartmentHeaders(): Observable<{ columnsMetadata: Array<ColumnsMetadata> }> {
    return this.http.get<{ columnsMetadata: Array<ColumnsMetadata> }>(
      'http://localhost:8090/employee/data-table-metadata/department'
    );
  }

  searchDepartmentById(departmentId: string): Observable<Department> {
    return this.http.get<Department>(
      'http://localhost:8090/employee/employee/departments/' + departmentId);
  }

  updateDepartment(departmentId: string): Observable<Department> {
    return this.http.put<Department>(
      'http://localhost:8090/employee/employee/departments/update',departmentId);
  }

  deleteDepartment(departmentId: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      'http://localhost:8090/employee/employee/departments/' + departmentId);
  }
  search(
    params: HttpParams
  ): Observable<{ content: Array<Department>; totalElements: number }> {
    return this.http.get<{ content: Array<Department>; totalElements: number }>(
      'http://localhost:8090/employee/employee/departments/search',
      {
        params: params,
      }
    );
}
notify(message: string) {
  this.toastrService.success(message, 'DEPARTMENT');
}

warn(message: string) {
  this.toastrService.warning(message);
}

sendData(data: string) {
  this.dataSubject.next(data);
}
}
