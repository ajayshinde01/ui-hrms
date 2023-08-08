import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ColumnsMetadata } from '../models/columnMetaData';
import { Designation } from '../models/designation.model';
import { ApiResponse } from '../models/response';
import { ToastrService } from 'ngx-toastr';
@Injectable()
export class DesignationService {
  constructor(private http: HttpClient, private toastrService: ToastrService) {}

  ngOnInit(): void {}

  getDesignationHeaders(): Observable<{
    columnsMetadata: Array<ColumnsMetadata>;
  }> {
    return this.http.get<{ columnsMetadata: Array<ColumnsMetadata> }>(
      'http://192.168.1.16:7000/employee/data-table-metadata/designation'
    );
  }

  createDesignation(data: Designation): Observable<Array<Designation>> {
    console.log('in create service', data);

    return this.http.post<Array<Designation>>(
      'http://192.168.1.16:7000/employee/designation/create',
      data
    );
  }

  searchDesignationById(id: string): Observable<Designation> {
    return this.http.get<Designation>(
      'http://192.168.1.16:7000/employee/designation/' + id
    );
  }

  updateDesignation(data: Designation): Observable<Array<Designation>> {
    console.log(data);
    return this.http.put<Array<Designation>>(
      'http://192.168.1.16:7000/employee/designation/update',
      data
    );
  }

  deleteDesignation(designationId: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      'http://192.168.1.16:7000/employee/designation/' +
        designationId +
        '?updatedBy=Admin'
    );
  }

  search(
    params: HttpParams
  ): Observable<{ content: Array<Designation>; totalElements: number }> {
    return this.http.get<{
      content: Array<Designation>;
      totalElements: number;
    }>('http://192.168.1.16:7000/employee/designation/search', {
      params: params,
    });
  }

  notify(message: string) {
    this.toastrService.success(message);
  }

  warn(message: string) {
    this.toastrService.warning(message);
  }
}
