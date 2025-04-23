import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { Toast, ToastComponent } from './shared/components/toast/toast.component';
import { ToastService } from './shared/services/toast.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private readonly toastService: ToastService, translate: TranslateService) {
    translate.addLangs(['fr', 'en']);
    translate.setDefaultLang('en');
    translate.use(translate.getBrowserLang() || 'en');
  }

  onDismissToast(toast: Toast) {
    this.toastService.dismiss(toast);
  }

  get toasts(): Toast[] {
    return this.toastService.toasts;
  }
}
