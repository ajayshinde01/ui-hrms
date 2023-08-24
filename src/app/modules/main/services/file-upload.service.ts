import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  constructor(private http: HttpClient) {}

  uploadImage(file: File): Observable<any> {
    const form = new FormData();
    form.append('file', file);
    return this.http.post('http://192.168.1.62:7010/file/save', form);
  }
}
