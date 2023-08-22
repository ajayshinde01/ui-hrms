import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ColumnsMetadata } from '../models/columnMetaData';
import { Organization } from '../models/organization.model';
import { IndividualConfig, ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  constructor(private http: HttpClient, private toastrService: ToastrService) {}

  ngOnInit(): void {}

  getOrganizations(): Observable<Array<Organization>> {
    return this.http.get<Array<Organization>>(
      'http://192.168.1.16:7000/employee/organization/get-all'
    );
  }

  getOrganizationsHeaders(): Observable<{
    columnsMetadata: Array<ColumnsMetadata>;
  }> {
    return this.http.get<{ columnsMetadata: Array<ColumnsMetadata> }>(
      'http://192.168.1.16:7000/employee/data-table-metadata/organization'
    );
  }

  createOrganization(data: Organization): Observable<Array<Organization>> {
    console.log('in create service', data);

    return this.http.post<Array<Organization>>(
      'http://192.168.1.16:7000/employee/organization/create',
      data
    );
  }

  searchOrganizationByCode(orgCode: string): Observable<Organization> {
    return this.http.get<Organization>(
      'http://192.168.1.16:7000/employee/organization/' + orgCode
    );
  }

  updateOrganization(data: Organization): Observable<Array<Organization>> {
    return this.http.put<Array<Organization>>(
      'http://192.168.1.16:7000/employee/organization/update',
      data
    );
  }

  deleteOrganization(orgCode: string): Observable<string> {
    return this.http.delete<string>(
      'http://192.168.1.16:7000/employee/organization/' +
        orgCode +
        '?updatedBy=Admin'
    );
  }

  search(
    params: HttpParams
  ): Observable<{ content: Array<Organization>; totalElements: number }> {
    return this.http.get<{
      content: Array<Organization>;
      totalElements: number;
    }>('http://192.168.1.16:7000/employee/organization/search', {
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
}
