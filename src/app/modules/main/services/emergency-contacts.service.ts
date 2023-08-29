import { Injectable } from '@angular/core';
import { EmergencyContacts } from '../models/emergency-contacts.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiResponse } from '../models/response';
import { ToastrService } from 'ngx-toastr';
import { ColumnsMetadata } from '../models/columns-metadata';

@Injectable()
export class EmergencyContactsService {
  private dataSubject = new BehaviorSubject<string>('');
  public data$ = this.dataSubject.asObservable();

  constructor(private http: HttpClient, private toastrService: ToastrService) {}

  getcontactHeaders(): Observable<{
    columnsMetadata: Array<ColumnsMetadata>;
  }> {
    return this.http.get<{ columnsMetadata: Array<ColumnsMetadata> }>(
      'http://localhost:8090/employee/data-table-metadata/emergency-contact'
    );
  }

  AddEmergencyContact(
    contact: EmergencyContacts,
    id: number
  ): Observable<EmergencyContacts> {
    console.log(id);
    return this.http.post<EmergencyContacts>(
      'http://localhost:8090/employee/contact/' + id + '/add',
      contact
    );
  }

  updateEmergencyContact(
    contact: EmergencyContacts,
    id: number
  ): Observable<EmergencyContacts> {
    return this.http.put<EmergencyContacts>(
      'http://localhost:8090/employee/contact/' + id + '/update',
      contact
    );
  }

  deleteContact(contactId: string, id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      `http://localhost:8090/employee/contact/${id}/${contactId}?updatedBy=Admin`
    );
  }

  search(
    params: HttpParams,
    id: string
  ): Observable<{ content: Array<EmergencyContacts>; totalElements: number }> {
    return this.http.get<{
      content: Array<EmergencyContacts>;
      totalElements: number;
    }>(`http://localhost:8090/employee/contact/${id}/search`, {
      params: params,
    });
  }

  notify(message: string) {
    this.toastrService.success(message);
  }

  warn(message: string) {
    this.toastrService.warning(message);
  }

  sendData(data: string) {
    console.log(data);
    this.dataSubject.next(data);
  }
}
