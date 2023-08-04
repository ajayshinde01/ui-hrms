import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ColumnsMetadata } from '../models/columnMetaData';
import { Grade } from '../models/grade.model';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse } from '../models/response';
@Injectable()
export class GradeService {
  constructor(private http: HttpClient, private toastrService: ToastrService) {}

  ngOnInit(): void {}

  getGradesHeaders(): Observable<{ columnsMetadata: Array<ColumnsMetadata> }> {
    return this.http.get<{ columnsMetadata: Array<ColumnsMetadata> }>(
      'http://localhost:8080/data-table-metadata/grade'
    );
  }

  createGrade(data: Grade): Observable<Array<Grade>> {
    console.log('in create service', data);

    return this.http.post<Array<Grade>>(
      'http://localhost:8080/employee/grade/create',
      data
    );
  }

  searchByGradeId(id: string): Observable<Grade> {
    return this.http.get<Grade>('http://localhost:8080/employee/grade/' + id);
  }

  updateGrade(data: Grade): Observable<Array<Grade>> {
    console.log(data);
    return this.http.put<Array<Grade>>(
      'http://localhost:8080/employee/grade/update',
      data
    );
  }

  deleteGrade(gradeId: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      'http://localhost:8080/employee/grade/delete/' + gradeId
    );
  }

  search(
    params: HttpParams
  ): Observable<{ content: Array<Grade>; totalElements: number }> {
    return this.http.get<{ content: Array<Grade>; totalElements: number }>(
      'http://localhost:8080/employee/grade/get',
      {
        params: params,
      }
    );
  }

  notify(message: string) {
    this.toastrService.success(message, 'Grade Master');
  }

  warn(message: string) {
    this.toastrService.warning(message);
  }
}
