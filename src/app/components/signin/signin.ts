import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {Router, RouterModule } from '@angular/router';
import { Auth } from '../../services/auth';
import { Password } from '../../services/password';

@Component({
  selector: 'app-signin',
  imports: [FormsModule,RouterModule],
  templateUrl: './signin.html',
  styleUrl: './signin.css',
})
export class Signin {
  email:string="";
  password:string="";
  role:string="GUEST";
  message:string="";
  constructor(private router:Router,private authService:Auth,private cdr: ChangeDetectorRef,private passwordService: Password){
  
  }
  onSubmit() {
    const message = this.passwordService.validate(this.password);
    if(this.email == null || this.email.trim().length<1){
      this.message="Email is Required";
      this.cdr.detectChanges();
      return;
    }
    if (message == null) {
      this.authService.register({
        email: this.email,
        password: this.password,
        role: this.role
      })
        .subscribe({
          next: () => this.router.navigate(['/login']),
          error: error => console.error(error)
        });
    } else {
      console.log(message);
      this.message=message;
      this.cdr.detectChanges();
    }
  }
}
