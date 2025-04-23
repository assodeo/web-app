import { KeyValuePipe } from '@angular/common';
import { booleanAttribute, Component, Input } from '@angular/core';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';

type Errors = Record<string, string>;

@Component({
  selector: 'app-form-field',
  imports: [
    ReactiveFormsModule,
    KeyValuePipe,
    TranslateDirective,
    TranslatePipe,
  ],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.css'
})
export class FormFieldComponent {
  @Input() id = '';

  @Input() label = '';

  @Input() type = 'text';

  @Input({ transform: booleanAttribute }) required = true;

  @Input({ transform: booleanAttribute }) showAsterisk = true;

  @Input() autocomplete = '';

  @Input({ transform: booleanAttribute }) autofocus = false;

  @Input({ transform: booleanAttribute }) fixedErrors = false;

  _control: FormControl = new FormControl();

  @Input()
  set control(value: AbstractControl) {
    this._control = value as FormControl;
  }

  _errors: Errors = {};

  @Input()
  set errors(errors: Errors) {
    for (const error in errors) {
      const keys = error.split(',');
      keys.forEach(key => this._errors[key] = errors[error]);
    }
  }

  hasError(error: string): boolean {
    if (this.fixedErrors) {
      return this._control.hasError(error) || this._control.hasError('required');
    } else {
      return this._control.hasError(error) && this._control.dirty;
    }
  }
}
