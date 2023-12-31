import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Employee } from '../models/employee.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { ColumnsMetadata } from '../models/columnMetaData';
import { ApiResponse } from '../models/response';
import { IndividualConfig, ToastrService } from 'ngx-toastr';

@Injectable()
export class EmployeeTypeService {
  constructor(private http: HttpClient, private toastrService: ToastrService) {}

  private dataSubject = new BehaviorSubject<string>('');
  public data$ = this.dataSubject.asObservable();

  createEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(
      'http://192.168.1.16:7000/employee/employee-type/create',
      employee
    );
  }

  getEmployeeTypes(): Observable<Array<Employee>> {
    return this.http.get<Array<Employee>>(
      'http://192.168.1.16:7000/employee/employee-type/get-all'
    );
  }

  getEmployeeTypeHeaders(): Observable<{
    columnsMetadata: Array<ColumnsMetadata>;
  }> {
    return this.http.get<{ columnsMetadata: Array<ColumnsMetadata> }>(
      'http://192.168.1.16:7000/employee/data-table-metadata/employeeType-type'
    );
  }

  searchEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(
      'http://192.168.1.16:7000/employee/employee-type/by-id/' + id
    );
  }

  updateEmployee(employeeTypeId: string): Observable<Employee> {
    return this.http.put<Employee>(
      'http://192.168.1.16:7000/employee/employee-type/update',
      employeeTypeId
    );
  }

  deleteEmployee(employeeTypeId: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      'http://192.168.1.16:7000/employee/employee-type/delete/' +
        employeeTypeId +
        '?updatedBy=Admin'
    );
  }

  search(
    params: HttpParams
  ): Observable<{ content: Array<Employee>; totalElements: number }> {
    return this.http.get<{ content: Array<Employee>; totalElements: number }>(
      'http://192.168.1.16:7000/employee/employee-type/search',
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
    console.log(data);
    this.dataSubject.next(data);
  }
}
