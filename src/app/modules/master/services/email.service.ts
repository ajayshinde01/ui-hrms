import { HttpClient,HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IndividualConfig, ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { Email } from '../models/email';
import { ColumnsMetadata } from '../models/columnMetaData';
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
      'http://192.168.1.16:7010/email/get',
      {
        params: params,
      }
    );
  }

  // createEmail(email:Email): Observable<Email> {
  //   console.log(email);
  //   return this.http.post<Email>(
  //     'http://192.168.1.16:7010/email/send',
  //     email
  //   );

  // }


  // createEmail(email: Email, file: File): Observable<any> {
  //   const formData: FormData = new FormData();
  //   formData.append('file', file);
  //   console.log(email);
  //   console.log(file);
  // console.log(formData);
  //   return this.http.post('http://192.168.1.16:7010/email/send', formData);
  // }

  //  createEmail(email: Email, file: File): Observable<any> {
  //   const formData: FormData = new FormData();
  //   formData.append('file', file);
  // console.log(formData);
  //   return this.http.post('http://192.168.1.16:7010/email/send', formData);
  // }

    createEmail(mailRequest:FormData,file:File): Observable<any> {
      
  
    return this.http.post('http://192.168.1.16:7010/email/send', mailRequest);
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
