import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { ColumnsMetadata } from '../models/columns-metadata';
import { Employee } from '../models/employee.model';
import { ApiResponse } from '../models/response';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  // notify(arg0: string) {
  //   throw new Error('Method not implemented.');
  // }
  constructor(private http: HttpClient, private toastrService: ToastrService) {}

  private dataSubject = new BehaviorSubject<string>('');
  public data$ = this.dataSubject.asObservable();

  getEmployeeHeaders(): Observable<{
    columnsMetadata: Array<ColumnsMetadata>;
  }> {
    return this.http.get<{ columnsMetadata: Array<ColumnsMetadata> }>(
      'http://localhost:8090/employee/data-table-metadata/employee'
    );
  }

  search(
    params: HttpParams
  ): Observable<{ content: Array<Employee>; totalElements: number }> {
    return this.http.get<{ content: Array<Employee>; totalElements: number }>(
      'http://localhost:8090/employee/search',
      {
        params: params,
      }
    );
  }

  deleteEmployee(employeeId: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      'http://localhost:8090/employee/' + employeeId + '?updatedBy=Admin'
    );
  }
  notify(message: string) {
    this.toastrService.success(message);
  }
}
