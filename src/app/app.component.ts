import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TranslatePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(translate: TranslateService) {
    translate.addLangs(['fr', 'en']);
    translate.setDefaultLang('en');
    translate.use(translate.getBrowserLang() || 'en');
  }
}
