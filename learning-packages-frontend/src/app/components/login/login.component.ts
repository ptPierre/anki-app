import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <ul class="nav nav-tabs card-header-tabs">
                <li class="nav-item">
                  <a class="nav-link" 
                     [class.active]="!isSignupMode" 
                     (click)="isSignupMode = false" 
                     href="javascript:void(0)">Login</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" 
                     [class.active]="isSignupMode" 
                     (click)="isSignupMode = true" 
                     href="javascript:void(0)">Sign Up</a>
                </li>
              </ul>
            </div>
            <div class="card-body">
              <h2 class="card-title text-center mb-4">
                {{ isSignupMode ? 'Create Account' : 'Login' }}
              </h2>
              <form (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="username" class="form-label">Username</label>
                  <input
                    type="text"
                    class="form-control"
                    id="username"
                    [(ngModel)]="username"
                    name="username"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    [(ngModel)]="password"
                    name="password"
                    required
                  />
                </div>
                <div *ngIf="isSignupMode" class="mb-3">
                  <label for="confirmPassword" class="form-label">Confirm Password</label>
                  <input
                    type="password"
                    class="form-control"
                    id="confirmPassword"
                    [(ngModel)]="confirmPassword"
                    name="confirmPassword"
                    required
                  />
                </div>
                <div *ngIf="error" class="alert alert-danger">
                  {{ error }}
                </div>
                <button type="submit" class="btn btn-primary w-100">
                  {{ isSignupMode ? 'Sign Up' : 'Login' }}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  username = '';
  password = '';
  confirmPassword = '';
  error = '';
  isSignupMode = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.username || !this.password) {
      this.error = 'Please enter both username and password';
      return;
    }

    if (this.isSignupMode) {
      if (this.password !== this.confirmPassword) {
        this.error = 'Passwords do not match';
        return;
      }
      
      this.authService.signup(this.username, this.password).subscribe({
        next: () => {
          this.router.navigate(['/packages']);
        },
        error: (err) => {
          console.error('Signup error:', err);
          this.error = err.error?.message || 'Error creating account';
        }
      });
    } else {
      this.authService.login(this.username, this.password).subscribe({
        next: () => {
          this.router.navigate(['/packages']);
        },
        error: (err) => {
          console.error('Login error:', err);
          this.error = 'Invalid username or password';
        }
      });
    }
  }
}