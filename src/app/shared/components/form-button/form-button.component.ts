import { Component, Input } from '@angular/core';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-form-button',
  imports: [
    TranslateDirective,
    TranslatePipe
  ],
  templateUrl: './form-button.component.html',
  styleUrl: './form-button.component.css'
})
export class FormButtonComponent {
  @Input() title = '';

  @Input() loading = false;

  @Input() disabled = false;
}
