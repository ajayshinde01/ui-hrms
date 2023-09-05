import { HttpClient, HttpParams } from '@angular/common/http';

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { WorkExperience } from '../models/work-experience.model';

import { ApiResponse } from '../models/response';

import { ToastrService } from 'ngx-toastr'; // Import ToastrService

import { ColumnsMetadata } from '../models/columns-metadata';

@Injectable({
  providedIn: 'root',
})
export class WorkExperienceService {
  constructor(private http: HttpClient, private toastrService: ToastrService) { }

  fetchWorkExperienceHeaders(): Observable<{
    columnsMetadata: Array<ColumnsMetadata>;
  }> {
    return this.http.get<{ columnsMetadata: Array<ColumnsMetadata> }>(
      'http://192.168.1.16:7000/employee/data-table-metadata/work-experience'
    );
  }

  createWorkExperience(
    workExperience: WorkExperience,

    employeeId: number
  ): Observable<WorkExperience> {
    return this.http.post<WorkExperience>(
      `http://192.168.1.16:7000/employee/work-experience/${employeeId}/add`,

      workExperience
    );
  }

  updateWorkExperience(
    workExperience: WorkExperience,

    employeeId: number
  ): Observable<WorkExperience> {
    return this.http.put<WorkExperience>(
      `http://192.168.1.16:7000/employee/work-experience/${employeeId}/update`,

      workExperience
    );
  }

  getWorkExperiences(employeeId: number): Observable<Array<WorkExperience>> {
    return this.http.get<Array<WorkExperience>>(
      `http://192.168.1.16:7000/employee/work-experience/${employeeId}/get-all`
    );
  }

  deleteWorkExperience(
    workExperienceId: number,

    employeeId: number
  ): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      `http://192.168.1.16:7000/employee/work-experience/${employeeId}/${workExperienceId}?updatedBy=Admin`
    );
  }

  getWorkExperienceById(
    employeeId: number,

    workExperienceId: number
  ): Observable<WorkExperience> {
    return this.http.get<WorkExperience>(
      `http://192.168.1.16:7000/employee/work-experience/${employeeId}/${workExperienceId}`
    );
  }

  searchWorkExperiences(
    params: HttpParams,

    employeeId: number
  ): Observable<{
    content: Array<WorkExperience>;

    totalElements: number;
  }> {
    return this.http.get<{
      content: Array<WorkExperience>;

      totalElements: number;
    }>(
      `http://192.168.1.16:7000/employee/work-experience/${employeeId}/search`,

      {
        params: params,
      }
    );
  }

  notify(message: string) {
    this.toastrService.success(message);
  }

  warn(message: string) {
    this.toastrService.warning(message);
  }
}
