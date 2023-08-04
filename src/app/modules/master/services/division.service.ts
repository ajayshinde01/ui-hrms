import { Injectable } from '@angular/core';
import{HttpClient, HttpParams} from '@angular/common/http'
import { BehaviorSubject, Observable } from 'rxjs';
import { Division } from '../models/division.model';
import { ColumnsMetadata } from '../models/columnMetaData';
import { ApiResponse } from '../models/response';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class DivisionService {
  private dataSubject = new BehaviorSubject<string>('');
  public data$ = this.dataSubject.asObservable();

  constructor(private http: HttpClient,private toastrService: ToastrService) { } 

  createDivision(division: Division):Observable<Division> {
    return this.http.post<Division>('http://localhost:8090/employee/employee/division/create', division);
  }

  getDivisions(): Observable<Array<Division>> {
    return this.http.get<Array<Division>>(
      'http://localhost:8090/employee//employee/division/get-all'
    );
  }

  getDivisionHeaders(): Observable<{ columnsMetadata: Array<ColumnsMetadata> }> {
    return this.http.get<{ columnsMetadata: Array<ColumnsMetadata> }>(
      'http://localhost:8090/employee/data-table-metadata/division'
    );
  }

 searchDivisionById(divisionId: string): Observable<Division> {
    return this.http.get<Division>(
      'http://localhost:8090/employee/employee/division/' + divisionId
    );
  }

  updateDivision(divisionId: string): Observable<Division> {
      return this.http.put<Division>(
        'http://localhost:8090/employee/employee/division/update',
        divisionId
      );
    }


  deleteDivision(divisionId: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      'http://localhost:8090/employee/employee/division/' + divisionId
    );
  }
  search(
    params: HttpParams
  ): Observable<{ content: Array<Division>; totalElements: number }> {
    return this.http.get<{ content: Array<Division>; totalElements: number }>(
      'http://localhost:8090/employee/employee/division/search',
      {
        params: params,
      }
    );
}
notify(message: string) {
  this.toastrService.success(message, 'Division');
}

warn(message: string) {
  this.toastrService.warning(message);
}

sendData(data: string) {
  console.log(data);
  this.dataSubject.next(data);
}
}
