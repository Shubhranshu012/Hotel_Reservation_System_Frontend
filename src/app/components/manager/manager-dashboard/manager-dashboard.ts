import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { HotelService } from '../../../services/hotels';
import { Auth } from '../../../services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../../services/booking';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './manager-dashboard.html',
  styleUrl: './manager-dashboard.css',
})
export class ManagerDashboard {
  roomNumber = '';
  status = '';
  type = '';
  price: number = 0;
  roomError: string = "";
  rooms: any[] = [];
  showReceptionistModal = false;

  receptionistEmail = '';
  receptionistPassword = '';
  receptionistError = '';

  openReceptionistModal() {
    this.showReceptionistModal = true;
  }

  closeReceptionistModal() {
    this.showReceptionistModal = false;
    this.receptionistEmail = '';
    this.receptionistPassword = '';
    this.receptionistError = '';
  }
  constructor(private router: Router, private bookingService: BookingService, private hotelService: HotelService, private cdr: ChangeDetectorRef, private authService: Auth) { }
  allRooms() {
    this.bookingService.getAllRooms().subscribe({
      next: (response) => {
        this.rooms = response;
        this.cdr.detectChanges();
      },
      error: error => console.log(error)
    });
  }
  ngOnInit(): void {
    if (localStorage.getItem('role') != "MANAGER") {
      this.router.navigate(["login"]);
    }
    this.allRooms();
    this.bookingService.getAllBooking().subscribe({
      next: (response) => {
        console.log(response);
      },
      error: error => console.log(error)
    });
  }
  onSubmit() {
    this.roomError = '';
    if (this.roomNumber.trim().length === 0) {
      this.roomError = 'Room Number is required';
      this.cdr.detectChanges();
      return;
    }
    if (this.status == "") {
      this.roomError = 'Status is required';
      this.cdr.detectChanges();
      return;
    }
    if (this.type == "") {
      this.roomError = 'Type is required';
      this.cdr.detectChanges();
      return;
    }
    if (this.price <= 0) {
      this.roomError = 'Price Should be More that 0';
      this.cdr.detectChanges();
      return;
    }
    const Payload = { roomNumber: this.roomNumber, status: this.status, type: this.type, price: this.price };
    this.hotelService.addRoom([Payload]).subscribe({
      next: (response) => {
        console.log(response);
        this.allRooms();
      },
      error: error => {
        console.log(error);
        this.cdr.detectChanges();
      }
    });
  }
  registerReceptionist() {
    this.receptionistError = '';
    if (!this.receptionistEmail || !this.receptionistPassword) {
      this.receptionistError = 'Email and Password are required';
      return;
    }
    const payload = {email: this.receptionistEmail,password: this.receptionistPassword};
    console.log('Register receptionist payload:', payload);
    this.authService.registerReceptionist(payload).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: error => {
        console.log(error);
        this.cdr.detectChanges();
      }
    })
    this.closeReceptionistModal();
  }
}
