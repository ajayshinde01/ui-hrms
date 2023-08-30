import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IndividualConfig, ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { EducationalQualification } from '../models/educational-qualification.model';
import { ColumnsMetadata } from '../models/columns-metadata';
import { ApiResponse } from '../models/response';

@Injectable({
  providedIn: 'root',
})
export class EducationalQualificationService {
  createEducationalQualification(
    educationalQualification: EducationalQualification,
    employeeId: number
  ): Observable<EducationalQualification> {
    return this.http.post<EducationalQualification>(
      `http://192.168.1.16:7000/employee/education/${employeeId}/add`,
      educationalQualification
    );
  }
  // searchScopeById(
  //   employeeId: number,
  //   educationalQualification: EducationalQualification
  // ) {
  //   return this.http.get<EducationalQualification>(
  //     `http://192.168.1.16:7000/employee/education/1/search?keyword=SSC&page=0&size=1&sort=educationalQualification`
  //   );
  // }
  updateEducationalQualification(
    educationalQualification: EducationalQualification,
    employeeId: number
  ) {
    return this.http.put<EducationalQualification>(
      `http://192.168.1.16:7000/employee/education/${employeeId}/update`,
      educationalQualification
    );
  }
  private dataSubject = new BehaviorSubject<string>('');
  public data$ = this.dataSubject.asObservable();

  constructor(private http: HttpClient, private toastrService: ToastrService) {}

  // createDivision(division: Division): Observable<Division> {
  //   return this.http.post<Division>(
  //     'http://192.168.1.16:7000/employee/division/create',
  //     division
  //   );
  // }

  getEducationalQualifications(
    employeeId: number
  ): Observable<Array<EducationalQualification>> {
    return this.http.get<Array<EducationalQualification>>(
      `http://192.168.1.16:7000/employee/education/${employeeId}/get-all`
    );
  }

  getEducationalQualificationHeaders(): Observable<{
    columnsMetadata: Array<ColumnsMetadata>;
  }> {
    return this.http.get<{ columnsMetadata: Array<ColumnsMetadata> }>(
      'http://192.168.1.16:7000/employee/data-table-metadata/educational-qualification'
    );
  }

  getByEmployeeId(
    employeeId: number,
    educationalId: number
  ): Observable<EducationalQualification> {
    return this.http.get<EducationalQualification>(
      `http://192.168.1.16:7000/employee/education/${employeeId}/${educationalId}`
    );
  }

  // updateDivision(divisionId: string): Observable<Division> {
  //   return this.http.put<Division>(
  //     'http://192.168.1.16:7000/employee/division/update',
  //     divisionId
  //   );
  // }

  deleteEducationalQualification(
    EducationalQualificationId: number,
    employeeId: number
  ): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      `http://192.168.1.16:7000/employee/education/${employeeId}/${EducationalQualificationId}?updatedBy='Admin'`
    );
  }
  search(
    params: HttpParams,
    employeeId: number
  ): Observable<{
    content: Array<EducationalQualification>;
    totalElements: number;
  }> {
    return this.http.get<{
      content: Array<EducationalQualification>;
      totalElements: number;
    }>(`http://192.168.1.16:7000/employee/education/${employeeId}/search`, {
      params: params,
    });
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
