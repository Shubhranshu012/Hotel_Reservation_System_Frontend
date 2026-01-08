import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  city = '';
  checkIn = '';
  checkOut = '';
  rooms = '';
  minDate: string = '';
  error: string = "";

  constructor(private router: Router, private cdr: ChangeDetectorRef) { }
  images = [
    'img1.jpg',
    'img2.jpg',
    'img3.jpg',
    'img4.jpg',
    'img5.jpg'
  ];
  currentIndex = 0;

  ngOnInit(): void {
    if (localStorage.getItem('role') === 'MANAGER') {
      this.router.navigate(['/manager/dashboard']);
    }
    if (localStorage.getItem('role') === 'RECEPTIONIST') {
      this.router.navigate(['/reception/dashboard']);
    }
    if (localStorage.getItem('role') === 'ADMIN') {
      this.router.navigate(['/admin/dashboard']);
    }
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
      this.cdr.detectChanges();
    }, 15000);
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }
  search() {
    this.city = this.city.trim();
    this.error = "";
    this.cdr.detectChanges();
    if (this.city.trim().length === 0) {
      this.error = "City Name is Required";
      this.cdr.detectChanges();
      return;
    }
    if (!this.checkIn || this.checkIn.trim().length === 0) {
      this.error = "CheckIn Date is Required";
      this.cdr.detectChanges();
      return;
    }

    if (!this.checkOut || this.checkOut.trim().length === 0) {
      this.error = "CheckOut Date is Required";
      this.cdr.detectChanges();
      return;
    }
    if (!this.rooms || this.rooms.trim().length === 0) {
      this.error = "Room Number is Required";
      this.cdr.detectChanges();
      return;
    }
    this.router.navigate(['/hotels'], {
      queryParams: {
        city: this.city,
        checkIn: this.checkIn,
        checkOut: this.checkOut,
        rooms: this.rooms
      }
    });
  }
}
