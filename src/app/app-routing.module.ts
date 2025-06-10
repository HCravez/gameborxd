import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { GameRegisterComponent } from './pages/game-register/game-register.component';
import { GameListComponent } from './pages/game-list/game-list.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'games/register', 
    component: GameRegisterComponent, 
    canActivate: [AuthGuard] 
  },
  {
    path: 'games/register/:id',
    loadComponent: () => import('./pages/game-register/game-register.component').then(m => m.GameRegisterComponent)
  },
  { 
    path: 'games/list', 
    component: GameListComponent, 
    canActivate: [AuthGuard] 
  },
  { path: '**', redirectTo: '' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }