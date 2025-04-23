import { Routes } from '@angular/router';

import { alreadyAuthGuard } from './core/auth/guards/already-auth.guard';
import { authGuard } from './core/auth/guards/auth.guard';
import { LoginFormComponent } from './core/auth/pages/login-form/login-form.component';
import { RegisterFormComponent } from './core/auth/pages/register-form/register-form.component';
import { HomeComponent } from './features/association/pages/home/home.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent, canActivate: [authGuard] },
  { path: 'login', title: 'Connexion', component: LoginFormComponent, canActivate: [alreadyAuthGuard]},
  { path: 'register', title: 'Inscription', component: RegisterFormComponent, canActivate: [alreadyAuthGuard]}
];
