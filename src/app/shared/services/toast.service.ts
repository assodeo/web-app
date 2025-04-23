import { Injectable } from '@angular/core';

import { Toast, ToastType } from '../components/toast/toast.component';

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: Toast[] = [];

  show(messageKey: string, type = ToastType.INFO, duration = 3000): void {
    const id = this.toasts.length;
    this.toasts.push({ id, messageKey, type, duration });

    setTimeout(() => this.dismissById(id), duration);
  }

  dismiss(toast: Toast): void {
    this.dismissById(toast.id);
  }

  private dismissById(id: number): void {
    const index = this.toasts.findIndex(toast => toast.id === id);
    if (index !== -1) {
      this.toasts.splice(index, 1);
    }
  }
}
