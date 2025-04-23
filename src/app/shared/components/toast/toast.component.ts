import { LowerCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateDirective } from '@ngx-translate/core';

export enum ToastType {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  INFO = 'INFO'
}

export interface Toast {
  id: number;
  messageKey: string;
  type: ToastType;
  duration: number;
}

@Component({
  selector: 'app-toast',
  imports: [
    TranslateDirective,
    LowerCasePipe
  ],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent {
  @Input() toast: Toast = {
    id: -1,
    messageKey: '',
    type: ToastType.INFO,
    duration: 3000
  };

  @Output() dismissed = new EventEmitter();

  dismiss() {
    this.dismissed.emit();
  }
}
