import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginService } from '../../services/login.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private loginService: LoginService, private router: Router) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const TOKEN = this.loginService.getToken();

    if (!TOKEN) {
      this.router.navigate(['/login']);
      return next.handle(request);
    }

    const req = request.clone({
      setHeaders: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    return next.handle(req);
  }
}
