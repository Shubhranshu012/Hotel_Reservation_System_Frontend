import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Password } from '../../services/password';
import { Auth } from '../../services/auth';
import { Loader } from '../loader/loader';

@Component({
  selector: 'app-profile',
  standalone:true,
  imports: [CommonModule,FormsModule,Loader],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit{
  constructor(private router:Router,private cdr: ChangeDetectorRef,private passwordService:Password,private authService:Auth ){}
  email:string = '';
  role:string = '';
  successMessage:string="";
  showModal = false;
  showBlur:boolean=true;
  errorMessage:string="";
  oldPassword = '';
  newPassword = '';
  ngOnInit(){
    this.email=localStorage.getItem('email')|| '';
    this.role=localStorage.getItem('role')|| '';
    if(localStorage.getItem('token')===null){
      this.router.navigate(['/']);
    }
    this.showBlur=false;
    this.cdr.detectChanges();
  }
  openChangePassword() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.oldPassword = '';
    this.newPassword = '';
  }

  changePassword() {
    if(this.oldPassword.trim().length<=0){
      this.errorMessage="Old Password Is Required";
      this.cdr.detectChanges();
      return;
    }
    if(this.newPassword.trim().length<=0){
      this.errorMessage="New Password Is Required";
      this.cdr.detectChanges();
      return;
    }
    if(this.oldPassword !== this.newPassword){
      this.errorMessage="Passwords Not same";
      this.cdr.detectChanges();
      return;
    }
    const message =this.passwordService.validate(this.newPassword);
    if(message==null){
      this.showBlur=true;
      const payload={email:this.email,oldPassword:this.oldPassword,newPassword:this.newPassword};
      this.authService.changePassword(payload).subscribe({
        next:(responce)=>{
          this.successMessage="Password Changed SuccessFully"
          this.cdr.detectChanges();
          setTimeout(() => {
            this.showBlur=false;
            this.closeModal();
            this.cdr.detectChanges();
          }, 2000);
        },
        error:(error)=>{
          this.showBlur=false;
          this.errorMessage="Something Went Wrong";
          this.cdr.detectChanges();
        }
      })
    }
    else{
      this.errorMessage=message;
      this.cdr.detectChanges();
      return;
    }
  }
}
