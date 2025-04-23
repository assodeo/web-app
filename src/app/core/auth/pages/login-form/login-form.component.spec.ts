import { HttpErrorResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { provideRouter, Router } from '@angular/router';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';

import { ToastType } from '../../../../shared/components/toast/toast.component';
import { ToastService } from '../../../../shared/services/toast.service';
import { AuthService } from '../../services/auth.service';

import { LoginFormComponent } from './login-form.component';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;

  let authService: jasmine.SpyObj<AuthService>;
  let toastService: jasmine.SpyObj<ToastService>;

  let router: Router;

  let usernameControl: AbstractControl;
  let passwordControl: AbstractControl;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['login']);
    toastService = jasmine.createSpyObj('ToastService', ['show']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: ToastService, useValue: toastService },
        provideHttpClientTesting(),
        provideTranslateService({
          loader: {
            provide: TranslateLoader,
            useFactory: () => ({})
          }
        }),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    router = TestBed.inject(Router);

    usernameControl = component.form.controls['username'];
    passwordControl = component.form.controls['password'];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form initially', () => {
    expect(component.form.valid).toBeFalse();
  });

  it('should validate email input', () => {
    usernameControl.setValue('invalid-email');
    fixture.detectChanges();

    expect(usernameControl.valid).toBeFalse();

    usernameControl.setValue('john.doe@example.com');
    fixture.detectChanges();

    expect(usernameControl.valid).toBeTrue();
  });

  it('should validate password input', () => {
    passwordControl.setValue('');
    fixture.detectChanges();

    expect(passwordControl.valid).toBeFalse();

    passwordControl.setValue('password');
    fixture.detectChanges();

    expect(passwordControl.valid).toBeTrue();
  });

  it('should call AuthService login on valid submit', fakeAsync(() => {
    const credentials = { username: 'john.doe@example.com', password: 'password' };

    authService.login.and.returnValue(of({ token: 'fake-token' }));
    spyOn(router, 'navigateByUrl');

    component.form.setValue(credentials);
    component.onSubmit();

    tick();

    expect(authService.login).toHaveBeenCalledWith(credentials);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  }));

  it('should handle invalid credentials', fakeAsync(() => {
    authService.login.and.returnValue(throwError(() => new HttpErrorResponse({ status: 401 })));

    component.form.setValue({ username: 'john.doe@example.com', password: 'wrongpassword' });
    component.onSubmit();

    fixture.detectChanges();

    tick();

    const error = fixture.nativeElement.querySelector('.form-error');
    expect(error.textContent).toContain('login.error.invalid-credentials');

    expect(component.invalidCredentials).toBeTrue();
    expect(passwordControl.value).toBe(null);
  }));

  it('should show error toast on server error', fakeAsync(() => {
    authService.login.and.returnValue(throwError(() => new HttpErrorResponse({ status: 500 })));

    component.form.setValue({ username: 'john.doe@example.com', password: 'password' });
    component.onSubmit();

    tick();

    expect(toastService.show).toHaveBeenCalledWith('error.internal', ToastType.ERROR);
  }));
});
