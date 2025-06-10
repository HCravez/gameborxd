import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user: Partial<User> = {
    name: '',
    email: '',
    password: ''
  };
  confirmPassword = '';
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.user.password !== this.confirmPassword) {
      this.error = 'As senhas não coincidem';
      return;
    }

    this.loading = true;
    this.error = '';

    
    const userToSave: User = {
      id: uuidv4(),
      name: this.user.name!,
      email: this.user.email!,
      password: this.user.password!
    };
    
    this.authService.register(userToSave).subscribe(success => {
      this.loading = false;
      if (success) {
        this.router.navigate(['/']);
      } else {
        this.error = 'Erro ao registrar. O email pode já estar em uso.';
      }
    });
  }
}