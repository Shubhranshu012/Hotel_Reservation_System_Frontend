import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { Loader } from '../loader/loader';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterModule,CommonModule,Loader],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  errorMessage: string = "";
  email: string = "";
  password: string = "";
  showBlur:boolean=false;
  constructor(private authService: Auth, private router: Router, private cdr: ChangeDetectorRef) {
  }

  onSubmit() {
    if(this.email.trim().length<=0){
      this.errorMessage="Email Is Required";
      this.cdr.detectChanges();
      return;
    }
    if(this.password.trim().length<=0){
      this.errorMessage="Password Is Required";
      this.cdr.detectChanges();
      return;
    }
    this.showBlur=true;
    this.errorMessage = '';
    this.authService.login({ "email": this.email, "password": this.password })
      .subscribe({
        next: (response) => {
          localStorage.setItem('token', response.Token);
          localStorage.setItem('role', response.role);
          localStorage.setItem('email', this.email);
          localStorage.setItem('hotelId', response.hotelId);
          console.log(response);
          const redirect = localStorage.getItem('redirectAfterLogin');
          if (redirect) {
            this.router.navigateByUrl(redirect);
          }
          else {
            this.router.navigate(['/']);                    
          }
        },
        error: error => {
          this.showBlur=false;
          if(error.status==404){
            this.errorMessage="Wrong Email Or Password";
          }
          else{
            this.errorMessage = error.error.loginRequest || "Wrong Email Or Password";
          }
          this.cdr.detectChanges();
        }
      });
      this.cdr.detectChanges();
  }
}
