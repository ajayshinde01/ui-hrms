import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { ColumnsMetadata } from '../models/columns-metadata';
import { Employee } from '../models/employee.model';
import { Visa } from 'src/app/modules/main/models/visa.model';
import { ApiResponse } from '../models/response';
import { Title } from '@angular/platform-browser';
import { CommonMaster } from '../models/common-master.model';
import { EmployeePersonalDetails } from '../models/employee-personal-details';

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

  createEmployee(employee: Employee): Observable<Employee> {
    console.log(employee);
    return this.http.post<Employee>(
      'http://192.168.1.16:7000/employee/add',
      employee
    );
  }

  AddPersonalDetails(employee: EmployeePersonalDetails): Observable<EmployeePersonalDetails> {
    console.log(employee);
    return this.http.post<EmployeePersonalDetails>(
      'http://192.168.1.16:7000/employee/personal-details/create',
      employee
    );
  }

  updateEmployee(Id: string): Observable<Employee> {
    return this.http.put<Employee>('http://192.168.1.16:7000/employee/update', Id);
  }

  searchEmployeeById(Id: string): Observable<Employee> {
    return this.http.get<Employee>('http://192.168.1.16:7000/employee/' + Id);
  }

  getEmployeeHeaders(): Observable<{
    columnsMetadata: Array<ColumnsMetadata>;
  }> {
    return this.http.get<{ columnsMetadata: Array<ColumnsMetadata> }>(
      'http://192.168.1.16:7000/employee/data-table-metadata/employee'
    );
  }

  getEmployeeVisaHeaders(): Observable<{
    columnsMetadata: Array<ColumnsMetadata>;
  }> {
    return this.http.get<{ columnsMetadata: Array<ColumnsMetadata> }>(
      'http://192.168.1.45:8090/employee/data-table-metadata/visa'
    );
  }

  search(
    params: HttpParams
  ): Observable<{ content: Array<Employee>; totalElements: number }> {
    return this.http.get<{ content: Array<Employee>; totalElements: number }>(
      'http://192.168.1.16:7000/employee/search',
      {
        params: params,
      }
    );
  }

  searchVisa(
    params: HttpParams
  ): Observable<{ content: Array<Visa>; totalElements: number }> {
    return this.http.get<{ content: Array<Visa>; totalElements: number }>(
      'http://192.168.1.16:7000/employee/search',
      {
        params: params,
      }
    );
  }

  deleteEmployee(employeeId: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      'http://192.168.1.16:7000/employee/' + employeeId + '?updatedBy=Admin'
    );
  }

  notify(message: string) {
    this.toastrService.success(message);
  }

  warn(message: string) {
    this.toastrService.warning(message);
  }

  sendData(data: string) {
    this.dataSubject.next(data);
  }

  getTitle(): Observable<Array<CommonMaster>> {
    return this.http.get<Array<CommonMaster>>(
      'http://192.168.1.16:7000/employee/common-master/Title?sort=priority,code'
    );
  }

  getGender(): Observable<Array<CommonMaster>> {

    return this.http.get<Array<CommonMaster>>(

      'http://192.168.1.16:7000/employee/common-master/Gender?sort=priority,code'

    );

  }

  getStatus(): Observable<Array<CommonMaster>> {

    return this.http.get<Array<CommonMaster>>(

      'http://192.168.1.16:7000/employee/common-master/Status?sort=priority,code'

    );

  }
}
