import { HttpClient,HttpHeaders,HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IndividualConfig, ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { Email } from '../models/email';
import { ColumnsMetadata } from '../models/columnMetaData';
import { ApiResponse } from '../models/response';
@Injectable()
export class EmailService {

  constructor(private http: HttpClient,private toastrService: ToastrService) { }
  private dataSubject = new BehaviorSubject<string>('');
  public data$ = this.dataSubject.asObservable();

  getEmailHeaders(): Observable<{
    columnsMetadata: Array<ColumnsMetadata>;
  }> {
    return this.http.get<{ columnsMetadata: Array<ColumnsMetadata> }>(
      'http://192.168.1.16:7010/data-table-metadata/email-info'
    );
  }

  search(
    params: HttpParams
  ): Observable<{ content: Array<Email>; totalElements: number }> {
    return this.http.get<{ content: Array<Email>; totalElements: number }>(
      'http://192.168.1.16:7010/email/get-all',
      {
        params: params,
      }
    );
  }

  searchEmailById(id: string): Observable<Email> {
    return this.http.get<Email>(
      'http://192.168.1.16:7010/email/get?id=' + id
    );
  }
      createEmail(formData:FormData): Observable<any> {
 
        const httpOptions = {
          headers: new HttpHeaders({
           "Content-Type": "multipart/form-data,application/json",
           "Access-Control-Allow-Origin": "*" 
          })
        };
  
    return this.http.post('http://192.168.1.16:7010/email/send', formData);
   
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
    this.dataSubject.next(data);
  }
}
