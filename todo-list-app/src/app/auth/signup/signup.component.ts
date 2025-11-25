import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../todo-list/services/auth.service';
import { passwordMatchValidator } from '../../validators/password-match.validator'; 
import { CommonModule } from '@angular/common'; 
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule, NgIf],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export default class SignupComponent implements OnInit {
  signupForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: passwordMatchValidator }
    );
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      this.authService.signup(this.signupForm.value).subscribe({
        next: (response: any) => {
          console.log('Registered successfully', response);
          this.router.navigate(['/login']); // Redirige al login
        },
        error: (error: any) => {
          console.error('Failed register', error);
          // Maneja el error de registro (ej., mostrar mensaje de error)
        },
      });
    }
  }
}