import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IndividualConfig, ToastrService } from 'ngx-toastr';
import { Parent } from '../models/parent';
import { ColumnsMetadata } from '../models/columnMetaData';
import { ApiResponse } from '../models/response';

@Injectable()
export class ChildService {
  constructor(private http: HttpClient, private toastrService: ToastrService) {}

  getChilds(masterName: string): Observable<Array<Parent>> {
    return this.http.get<Array<Parent>>(
      'http://192.168.1.16:7000/employee/common-master/masterName/search-childs'
    );
  }

  getChildHeaders(): Observable<{ columnsMetadata: Array<ColumnsMetadata> }> {
    return this.http.get<{ columnsMetadata: Array<ColumnsMetadata> }>(
      'http://192.168.1.16:7000/employee/data-table-metadata/child-common-master'
    );
  }

  // createParent(data: Parent): Observable<Parent> {
  //   return this.http.post<Parent>(
  //     'http://192.168.1.16:7000/employee/common-master/create',
  //     data
  //   );
  // }
  // Needs to modify
  // searchParentById(id: string): Observable<Parent> {
  //   return this.http.get<Parent>(
  //     'http://192.168.1.16:7000/employee/common-master/get/' + id
  //   );
  // }

  deleteChild(childId: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      'http://192.168.1.16:7000/employee/common-master/' +
        childId +
        '?updatedBy=Admin'
    );
  }

  search(
    masterName: string,
    params: HttpParams
  ): Observable<{ content: Array<Parent>; totalElements: number }> {
    const url = `http://192.168.1.16:7000/employee/common-master/${masterName}/search-childs`;

    return this.http.get<{ content: Array<Parent>; totalElements: number }>(
      url,
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
}
