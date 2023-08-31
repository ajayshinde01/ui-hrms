import { Injectable } from '@angular/core';
import { Certification } from '../models/certification.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IndividualConfig, ToastrService } from 'ngx-toastr';
import { ColumnsMetadata } from '../models/columns-metadata';
import { ApiResponse } from '../models/response';

@Injectable({
  providedIn: 'root',
})
export class CertificationService {
  createCertifications(
    certification: Certification,
    employeeId: number
  ): Observable<Certification> {
    return this.http.post<Certification>(
      `http://192.168.1.16:7000/employee/certification/${employeeId}/add`,
      certification
    );
  }

  updateCertification(certification: Certification, employeeId: number) {
    return this.http.put<Certification>(
      `http://192.168.1.16:7000/employee/certification/${employeeId}/update`,
      certification
    );
  }
  private dataSubject = new BehaviorSubject<string>('');
  public data$ = this.dataSubject.asObservable();

  constructor(private http: HttpClient, private toastrService: ToastrService) {}

  getCertifications(employeeId: number): Observable<Array<Certification>> {
    return this.http.get<Array<Certification>>(
      `http://192.168.1.16:7000/employee/education/${employeeId}/get-all`
    );
  }

  getCertificationsHeaders(): Observable<{
    columnsMetadata: Array<ColumnsMetadata>;
  }> {
    return this.http.get<{ columnsMetadata: Array<ColumnsMetadata> }>(
      'http://192.168.1.16:7000/employee/data-table-metadata/certification'
    );
  }

  getByEmployeeId(
    employeeId: number,
    certificationId: number
  ): Observable<Certification> {
    return this.http.get<Certification>(
      `http://192.168.1.16:7000/employee/certification/${employeeId}/${certificationId}`
    );
  }

  deleteCertifications(
    certificationsId: number,
    employeeId: number
  ): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      `http://192.168.1.16:7000/employee/certification/${employeeId}/${certificationsId}?updatedBy='Admin'`
    );
  }
  search(
    params: HttpParams,
    employeeId: number
  ): Observable<{
    content: Array<Certification>;
    totalElements: number;
  }> {
    return this.http.get<{
      content: Array<Certification>;
      totalElements: number;
    }>(`http://192.168.1.16:7000/employee/certification/${employeeId}/search`, {
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
