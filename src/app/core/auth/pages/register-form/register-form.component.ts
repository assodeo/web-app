import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';

import { FormButtonComponent } from '../../../../shared/components/form-button/form-button.component';
import { FormFieldComponent } from '../../../../shared/components/form-field/form-field.component';
import { ToastType } from '../../../../shared/components/toast/toast.component';
import { ToastService } from '../../../../shared/services/toast.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  imports: [
    ReactiveFormsModule,
    FormButtonComponent,
    FormFieldComponent,
    TranslateDirective,
    TranslatePipe,
    RouterLink
  ],
  styleUrl: './register-form.component.css'
})
export class RegisterFormComponent {
  readonly MIN_PASSWORD_LENGTH = 8;

  form: FormGroup;
  isSubmitting = false;

  constructor(
    private readonly authService: AuthService,
    private readonly toastService: ToastService,
    private readonly router: Router,
    fb: FormBuilder
  ) {
    this.form = fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      username: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(this.MIN_PASSWORD_LENGTH),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
      ]]
    });
  }

  onSubmit() {
    if (this.form.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    this.authService.register(this.form.value)
      .subscribe({
        next: () => {
          this.isSubmitting = false;

          this.toastService.show('register.success', ToastType.SUCCESS);

          void this.router.navigate(['/login']);
        },
        error: (error: HttpErrorResponse) => {
          this.isSubmitting = false;

          if (error.status === 409) {
            // Username already exists
            const username = this.form.value.username;

            this.form.controls['username'].setValidators([Validators.required, Validators.email, usernameAlreadyExists(username)]);
            this.form.controls['username'].updateValueAndValidity();
          } else {
            // Other error
            this.toastService.show('error.internal', ToastType.ERROR);
          }
        }
      });
  }
}

function usernameAlreadyExists(username: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return control.value === username
      ? { usernameAlreadyExists: { value: control.value } }
      : null;
  };
}
