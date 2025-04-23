import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';

import { FormButtonComponent } from '../../../../shared/components/form-button/form-button.component';
import { FormFieldComponent } from '../../../../shared/components/form-field/form-field.component';
import { ToastType } from '../../../../shared/components/toast/toast.component';
import { ToastService } from '../../../../shared/services/toast.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-form',
  imports: [
    ReactiveFormsModule,
    FormButtonComponent,
    FormFieldComponent,
    TranslateDirective,
    TranslatePipe,
    RouterLink
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {
  form: FormGroup;
  isSubmitting = false;

  invalidCredentials = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly toastService: ToastService,
    formBuilder: FormBuilder
  ) {
    this.form = formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    this.authService.login(this.form.value)
      .subscribe({
        next: () => {
          this.isSubmitting = false;

          const redirect = this.route.snapshot.queryParams['redirect'] || '/';
          void this.router.navigateByUrl(redirect);
        },
        error: (error: HttpErrorResponse) => {
          this.isSubmitting = false;

          if (error.status === 401) {
            this.invalidCredentials = true;
            this.form.controls['password'].reset();
          } else {
            this.toastService.show('error.internal', ToastType.ERROR);
          }
        }
      });
  }
}
