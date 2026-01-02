import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone:true,
  imports: [RouterModule,CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  constructor(private router:Router){}
  logout(){
    localStorage.clear();
    this.router.navigate(['home']);
  }
  isLoggedIn(){
    if(localStorage.getItem('token')!=null){
      return true;
    }
    return false;
  }
  isManager(){
    if(localStorage.getItem('role')=='MANAGER'){
      return true;
    }
    return false;
  }
  isAdmin(){
    if(localStorage.getItem('role')=='ADMIN'){
      return true;
    }
    return false;
  }
  isReceptionist(){
    if(localStorage.getItem('role')=='RECEPTIONIST'){
      return true;
    }
    return false;
  }
}
