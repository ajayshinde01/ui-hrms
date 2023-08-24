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
    return this.http.post('http://192.168.1.16:7010/file/save', form);
  }

  removeImage(file: String): Observable<any> {

    return this.http.delete('http://192.168.1.16:7010/file/delete?file='+file);
   // const form = new FormData();
   // form.append('file', file);
   // return this.http.post('http://192.168.1.62:7010/file/save', form);
  }


}
