import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';

import { ToastType } from '../../../shared/components/toast/toast.component';
import { ToastService } from '../../../shared/services/toast.service';
import { AuthService } from '../services/auth.service';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const route = inject(ActivatedRoute);

  const authService = inject(AuthService);
  const token = authService.getToken();

  const toastService = inject(ToastService);

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Expired token
        toastService.show('error.expired', ToastType.ERROR);
        authService.logout(route.snapshot.url);
      }

      return throwError(() => error);
    })
  );
}
