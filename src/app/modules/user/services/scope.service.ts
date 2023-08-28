import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { ColumnsMetadata } from '../models/columns-metadata';
import { Scope } from '../models/scope.model';
import { ApiResponse } from '../models/response';

@Injectable({
  providedIn: 'root',
})
export class ScopeService {
  constructor(private http: HttpClient, private toastrService: ToastrService) {}

  getScopeHeaders(): Observable<{
    columnsMetadata: Array<ColumnsMetadata>;
  }> {
    return this.http.get<{ columnsMetadata: Array<ColumnsMetadata> }>(
      'http://192.168.1.16:7080/data-table-metadata/scope'
    );
  }

  search(
    params: HttpParams
  ): Observable<{ content: Array<Scope>; totalElements: number }> {
    return this.http.get<{ content: Array<Scope>; totalElements: number }>(
      'http://192.168.1.16:7080/scope/search',
      {
        params: params,
      }
    );
  }

  createScope(scope: Scope): Observable<Scope> {
    return this.http.post<Scope>(
      'http://192.168.1.16:7080/scope/create',
      scope
    );
  }

  getScopes(): Observable<Array<Scope>> {
    return this.http.get<Array<Scope>>(
      'http://192.168.1.16:7080/scope/get-all'
    );
  }

  searchScopeById(scopeId: string): Observable<Scope> {
    return this.http.get<Scope>('http://192.168.1.16:7080/scope/' + scopeId);
  }

  updateScope(scope: Scope): Observable<Scope> {
    return this.http.put<Scope>('http://192.168.1.16:7080/scope', scope);
  }

  deleteScope(scopeId: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      'http://192.168.1.16:7080/scope/' + scopeId
    );
  }

  notify(message: string) {
    this.toastrService.success(message);
  }

  warn(message: string) {
    this.toastrService.warning(message);
  }
}
