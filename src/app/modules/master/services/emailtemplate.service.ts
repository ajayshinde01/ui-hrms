import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EmailTemplate } from '../models/emailTemplate';
import { BehaviorSubject, Observable } from 'rxjs';
import {IndividualConfig, ToastrService } from 'ngx-toastr';
import { ColumnsMetadata } from '../models/columnMetaData';
import { ApiResponse } from '../models/response';

@Injectable()
export class EmailtemplateService {

  constructor(private http: HttpClient,private toastrService: ToastrService) { }
private dataSubject = new BehaviorSubject<string>('');
  public data$ = this.dataSubject.asObservable();
  createEmailTemplate(emailtemplate:EmailTemplate): Observable<EmailTemplate> {
    return this.http.post<EmailTemplate>(
      'http://192.168.1.16:7010/template/create',
      emailtemplate
    );
  }

  getEmailTemplateHeaders(): Observable<{
    columnsMetadata: Array<ColumnsMetadata>;
  }> {
    return this.http.get<{ columnsMetadata: Array<ColumnsMetadata> }>(
      'http://192.168.1.16:7010/data-table-metadata/template-info'
    );
  }

  searchEmailTemplateById(id: number): Observable<EmailTemplate> {
    return this.http.get<EmailTemplate>(
      'http://192.168.1.16:7010/template/' + id
    );
  }

  updateEmailTemplateById(id: number): Observable<EmailTemplate> {
    return this.http.put<EmailTemplate>(
      'http://192.168.1.16:7010/template/update',
      id
    );
  }

  search(
    params: HttpParams
  ): Observable<{ content: Array<EmailTemplate>; totalElements: number }> {
    return this.http.get<{ content: Array<EmailTemplate>; totalElements: number }>(
      'http://192.168.1.16:7010/template/get-all',
      {
        params: params,
      }
    );
  }

  deleteEmailTemplate(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      'http://192.168.1.16:7010/template/' +
        id +
        '?updatedBy=Admin'
    );
  }
  //http://192.168.1.16:7010/template/get-all
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
    this.dataSubject.next(data);
  }
}
