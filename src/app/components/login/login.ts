import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule,RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  errorMessage: string = "";
  email: string = "";
  password: string = "";
  constructor(private authService: Auth, private router: Router, private cdr: ChangeDetectorRef) {
  }
  
  onSubmit() {
    this.errorMessage = '';
    this.authService.login({ "email": this.email, "password": this.password })
      .subscribe({
        next: (response) => {
          localStorage.setItem('token', response.Token);
          localStorage.setItem('role', response.role);
          localStorage.setItem('email', this.email);
          localStorage.setItem('hotelId',response.hotelId);
          console.log(response);
          this.router.navigate(["/"])
        },
        error: error => {
          console.log(error);
          if (error.status === 403) {
            this.errorMessage = 'Wrong UserName or Password';
          } else {
            this.errorMessage = 'Login failed. Please try again.';
          }
          this.cdr.detectChanges();
        }
      });
  }
}
