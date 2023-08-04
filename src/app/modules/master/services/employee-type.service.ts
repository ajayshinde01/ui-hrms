import { Injectable } from '@angular/core';
import{HttpClient, HttpParams} from '@angular/common/http'
import { Employee } from '../models/employee.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { ColumnsMetadata } from '../models/columnMetaData';
import { ApiResponse } from '../models/response';
import { ToastrService } from 'ngx-toastr';

@Injectable()

export class EmployeeTypeService {

  constructor(private http: HttpClient,private toastrService: ToastrService) { } 

  private dataSubject = new BehaviorSubject<string>('');
  public data$ = this.dataSubject.asObservable();

 

  createEmployee(employee: Employee):Observable<Employee> {
    return this.http.post<Employee>('http://localhost:8090/employee/employee-type/save', employee);
  }

  getEmployeeTypes(): Observable<Array<Employee>> {
    return this.http.get<Array<Employee>>(
      'http://localhost:8090/employee/employee-type/show-all'
    );
  }

  getEmployeeTypeHeaders(): Observable<{ columnsMetadata: Array<ColumnsMetadata> }> {
    return this.http.get<{ columnsMetadata: Array<ColumnsMetadata> }>(
      'http://localhost:8090/employee/data-table-metadata/employeeType-type'
    );
  }

  searchEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(
      'http://localhost:8090/employee/employee-type/by-id/' + id
    );
  }

  updateEmployee(employeeTypeId: string): Observable<Employee> {
    return this.http.put<Employee>(
      'http://localhost:8090/employee/employee-type/update',
      employeeTypeId
    );
  }

  deleteEmployee(employeeTypeId: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      'http://localhost:8090/employee/employee-type/delete/' + employeeTypeId
    );
  }

  search(
    params: HttpParams
  ): Observable<{ content: Array<Employee>; totalElements: number }> {
    return this.http.get<{ content: Array<Employee>; totalElements: number }>(
      'http://localhost:8090/employee/employee-type/search',
      {
        params: params,
      }
    );
  }

  notify(message: string) {
    this.toastrService.success(message, 'Employee Type');
  }

  warn(message: string) {
    this.toastrService.warning(message);
  }
  
  sendData(data: string) {
    console.log(data);
    this.dataSubject.next(data);
  }

}
