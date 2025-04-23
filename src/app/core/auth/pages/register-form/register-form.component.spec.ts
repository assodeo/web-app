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

import { RegisterFormComponent } from './register-form.component';

describe('RegisterFormComponent', () => {
  let component: RegisterFormComponent;
  let fixture: ComponentFixture<RegisterFormComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let toastService: jasmine.SpyObj<ToastService>;
  let router: Router;

  let firstNameControl: AbstractControl;
  let lastNameControl: AbstractControl;
  let usernameControl: AbstractControl;
  let passwordControl: AbstractControl;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['register']);
    toastService = jasmine.createSpyObj('ToastService', ['show']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
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

    fixture = TestBed.createComponent(RegisterFormComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);

    fixture.detectChanges();

    firstNameControl = component.form.controls['firstName'];
    lastNameControl = component.form.controls['lastName'];
    usernameControl = component.form.controls['username'];
    passwordControl = component.form.controls['password'];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form initially', () => {
    expect(component.form.valid).toBeFalse();
  });

  it('should validate first name input', () => {
    firstNameControl.setValue('');
    fixture.detectChanges();

    expect(firstNameControl.valid).toBeFalse();

    firstNameControl.setValue('John');
    fixture.detectChanges();

    expect(firstNameControl.valid).toBeTrue();
  });

  it('should validate last name input', () => {
    lastNameControl.setValue('');
    fixture.detectChanges();

    expect(lastNameControl.valid).toBeFalse();

    lastNameControl.setValue('Doe');
    fixture.detectChanges();

    expect(lastNameControl.valid).toBeTrue();
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

    passwordControl.setValue('weakpass');
    fixture.detectChanges();

    expect(passwordControl.valid).toBeFalse();

    passwordControl.setValue('Password1!');
    fixture.detectChanges();

    expect(passwordControl.valid).toBeTrue();
  });

  it('should call AuthService register on valid submit', fakeAsync(() => {
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      username: 'john.doe@example.com',
      password: 'Password1!'
    };

    authService.register.and.returnValue(of({
      firstName: userData.firstName,
      lastName: userData.lastName,
      username: userData.username
    }));

    spyOn(router, 'navigate');

    component.form.setValue(userData);

    component.onSubmit();

    tick();

    expect(authService.register).toHaveBeenCalledWith(userData);
    expect(toastService.show).toHaveBeenCalledWith('register.success', ToastType.SUCCESS);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  }));

  it('should handle username already exists error', fakeAsync(() => {
    authService.register.and.returnValue(throwError(() => new HttpErrorResponse({ status: 409 })));

    component.form.setValue({
      firstName: 'John',
      lastName: 'Doe',
      username: 'existing@example.com',
      password: 'Password1!'
    });

    component.onSubmit();

    tick();

    expect(component.form.controls['username'].hasError('usernameAlreadyExists')).toBeTrue();
  }));

  it('should show error toast on server error', fakeAsync(() => {
    authService.register.and.returnValue(throwError(() => new HttpErrorResponse({ status: 500 })));

    component.form.setValue({
      firstName: 'John',
      lastName: 'Doe',
      username: 'john.doe@example.com',
      password: 'Password1!'
    });

    component.onSubmit();

    tick();

    expect(toastService.show).toHaveBeenCalledWith('error.internal', ToastType.ERROR);
  }));
});
