import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { HotelService } from '../../../services/hotels';
import { Auth } from '../../../services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../../services/booking';
import { Password } from '../../../services/password';
import { Loader } from '../../loader/loader';
import { flush } from '@angular/core/testing';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule,Loader],
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
  showBlur: boolean = true
  receptionistEmail = '';
  receptionistPassword = '';
  receptionistConfirmPassword = '';
  receptionistError = '';
  bookedRooms: any[] = [];

  monthlySummary: any[] = [];
  yearlySummary: any[] = [];
  openReceptionistModal() {
    this.showReceptionistModal = true;
  }
  getRoomNumber(roomId: string): string {
    const room = this.rooms.find(r => r.id === roomId);
    return room ? room.roomNumber : '—';
  }

  closeReceptionistModal() {
    this.showReceptionistModal = false;
    this.receptionistEmail = '';
    this.receptionistPassword = '';
    this.receptionistError = '';
  }
  constructor(private passwordService: Password, private router: Router, private bookingService: BookingService, private hotelService: HotelService, private cdr: ChangeDetectorRef, private authService: Auth) { }
  allRooms() {
    this.bookingService.getAllRooms().subscribe({
      next: (response) => {
        this.rooms = response;
        this.showBlur=false;
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
        this.bookedRooms = response;
        this.generateBookingSummary();
        this.showBlur=false;
        this.cdr.detectChanges();
      },
      error: error => console.log(error)
    });
  }
  generateBookingSummary() {
    const monthMap: any = {};
    const yearMap: any = {};

    this.bookedRooms.forEach(booking => {
      const date = new Date(booking.checkInDate);
      const monthKey = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      const yearKey = date.getFullYear();
      if (!monthMap[monthKey]) {
        monthMap[monthKey] = { month: monthKey, bookings: 0, revenue: 0 };
      }
      monthMap[monthKey].bookings += 1;
      monthMap[monthKey].revenue += booking.price || 0;
      if (!yearMap[yearKey]) {
        yearMap[yearKey] = { year: yearKey, bookings: 0, revenue: 0 };
      }
      yearMap[yearKey].bookings += 1;
      yearMap[yearKey].revenue += booking.price || 0;
    });

    this.monthlySummary = Object.values(monthMap);
    this.yearlySummary = Object.values(yearMap);
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
    this.showBlur=true;
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
    if (this.receptionistConfirmPassword !== this.receptionistPassword) {
      this.receptionistError = 'Confirm Password Not Same';
      this.cdr.detectChanges();
      return;
    }
    this.showBlur=true;
    const validate = this.passwordService.validate(this.receptionistPassword);
    if (validate == null) {
      const payload = { email: this.receptionistEmail, password: this.receptionistPassword,confirmPassword:this.receptionistConfirmPassword };
      console.log('Register receptionist payload:', payload);
      this.authService.registerReceptionist(payload).subscribe({
        next: (response) => {
          console.log(response);
          this.closeReceptionistModal();
          this.cdr.detectChanges();
        },
        error: error => {
          console.log(error);
          this.receptionistError=error.error.error;
          this.cdr.detectChanges();
        }
      })
      this.showBlur=false;
    }
    else {
      this.receptionistError = validate;
      this.cdr.detectChanges();
      return;
    }
  }
}
