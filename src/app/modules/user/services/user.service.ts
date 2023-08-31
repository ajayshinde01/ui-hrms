import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { ColumnsMetadata } from '../models/columns-metadata';
import { User } from '../models/user.model';
import { ApiResponse } from '../models/response';
import { CommonMaster } from '../models/common-master.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private dataSubject = new BehaviorSubject<string>('');
  public data$ = this.dataSubject.asObservable();

  constructor(private http: HttpClient, private toastrService: ToastrService) {}

  getUserHeaders(): Observable<{
    columnsMetadata: Array<ColumnsMetadata>;
  }> {
    return this.http.get<{ columnsMetadata: Array<ColumnsMetadata> }>(
      'http://localhost:7080/data-table-metadata/user'
    );
  }

  search(
    params: HttpParams
  ): Observable<{ content: Array<User>; totalElements: number }> {
    return this.http.get<{ content: Array<User>; totalElements: number }>(
      'http://localhost:7080/user/search',
      {
        params: params,
      }
    );
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>('http://localhost:7080/user/create', user);
  }

  getUsers(): Observable<Array<User>> {
    return this.http.get<Array<User>>('http://localhost:7080/user/get-all');
  }

  searchUserById(userId: string): Observable<User> {
    return this.http.get<User>('http://localhost:7080/user/' + userId);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>('http://localhost:7080/user', user);
  }

  deleteUser(userId: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      'http://localhost:7080/user/' + userId
    );
  }

  getUserStatus(): Observable<Array<CommonMaster>> {
    return this.http.get<Array<CommonMaster>>(
      'http://192.168.1.16:7000/employee/common-master/User Status?sort=priority,code'
    );
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
