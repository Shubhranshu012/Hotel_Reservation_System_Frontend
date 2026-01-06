import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../../services/booking';
import { Loader } from '../../loader/loader';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule,Loader],
  templateUrl: './user-dashboard.html',
  styleUrls: ['./user-dashboard.css'],
})
export class UserDashboard {
  bookings: any[] = [];

  showModifyModal = false;
  showCancelModal = false;

  selectedBooking: any = null;

  newCheckIn = '';
  newCheckOut = '';
  showBlur: boolean = true;
  minDate: string = '';
  errorMessage:string ="";
  constructor(private bookingService: BookingService,private cdr: ChangeDetectorRef) {}
  getAllBookings(){
    this.bookingService.getUserHotel().subscribe({
      next: (res) => {
        this.bookings = res;
        this.showBlur=false;
        this.cdr.detectChanges();

      },
      error: err => console.log(err)
    });
  }
  ngOnInit() {
    this.getAllBookings();
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  openModify(booking: any) {
    this.selectedBooking = booking;
    this.newCheckIn = booking.checkInDate;
    this.newCheckOut = booking.checkOutDate;
    this.showModifyModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeModify() {
    this.showModifyModal = false;
    this.selectedBooking = null;
    document.body.style.overflow = 'auto';
  }

  confirmModify() {
    if(this.newCheckIn  === '' || this.newCheckOut === '' ){
      this.errorMessage="Check In and Chech Out Date is required";
      this.cdr.detectChanges();
      return;
    }
    this.showBlur=true;
    const payload={checkInDate: this.newCheckIn,checkOutDate: this.newCheckOut}
    this.bookingService.updateUserHotel(payload,this.selectedBooking.id).subscribe({
      next: (res) => {
        this.showBlur=false;
        this.getAllBookings();
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.showBlur=false;
        this.errorMessage=error.error.changeRequest || error.error.error;
        console.log(error);
      }
    })
    this.closeModify();
  }
  openCancel(booking: any) {
    this.selectedBooking = booking;
    this.showCancelModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeCancel() {
    this.showCancelModal = false;
    this.selectedBooking = null;
    document.body.style.overflow = 'auto';
  }
  confirmCancel() {
    console.log('Cancel booking:', this.selectedBooking);
    this.bookingService.cancelUserHotel(this.selectedBooking.id).subscribe({
      next: (res) => {
        this.getAllBookings();;
      },
      error: err => console.log(err)
    })
    this.closeCancel();
  }
}
