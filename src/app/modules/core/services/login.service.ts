import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LoginResponse } from '../model/loginResponse';
import { LoginRequest } from '../model/loginRequest';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}

  authenticate(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      'http://192.168.1.16:7020/auth/login',
      data
    );
  }

  setToken(data: LoginRequest): Observable<LoginResponse> {
    return this.authenticate(data).pipe(
      tap((response) => {
        const jwtToken = response.jwtToken;

        sessionStorage.setItem('jwtToken', jwtToken);
      })
    );
  }

  getToken() {
    let token = sessionStorage.getItem('jwtToken');
    return token;
  }
}
