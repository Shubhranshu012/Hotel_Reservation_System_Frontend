import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../services/auth';
import { Password } from '../../services/password';
import { CommonModule } from '@angular/common';
import { Loader } from '../loader/loader';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule, Loader],
  templateUrl: './signin.html',
  styleUrl: './signin.css',
})
export class Signin {
  email: string = "";
  password: string = "";
  confirmPassword: string = "";
  role: string = "GUEST";
  message: string = "";
  successMessage:string="";
  showBlur: boolean = false;
  constructor(private router: Router, private authService: Auth, private cdr: ChangeDetectorRef, private passwordService: Password) {

  }
  onSubmit() {
    const pass = this.passwordService.validate(this.password);
    if (this.email == null || this.email.trim().length < 1) {
      this.message = "Email is Required";
      this.cdr.detectChanges();
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.message = "Confirm Password Not Same";
      this.cdr.detectChanges();
      return;
    }
    if (pass == null) {
      this.showBlur = true;
      this.authService.register({
        email: this.email,
        password: this.password,
        confirmPassword: this.confirmPassword,
        role: this.role
      })
        .subscribe({
          next: () => {
            this.successMessage = "Registration successful! Redirecting to login...";
            this.cdr.detectChanges();
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          },
          error:(error) => {
            console.log(error);
            this.showBlur=false;
            this.message=error.error.error||error.error.registerRequest;
            this.cdr.detectChanges();
          } 
        });
    } else {
      this.showBlur = false;
      console.log(pass);
      this.message = pass;
      this.cdr.detectChanges();
    }
  }
}
