import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../../services/booking';
import { HotelService } from '../../../services/hotels';
import { Loader } from '../../loader/loader';

@Component({
  selector: 'app-reception-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, Loader],
  templateUrl: './reception-dashboard.html',
  styleUrl: './reception-dashboard.css',
})
export class ReceptionDashboard {
  checkInDate = '';
  checkOutDate = '';
  rooms: any[] = [];
  bookingRooms: any[] = [];
  submitError="";
  showModal = false;
  selectedRoom: any = null;
  customerEmail = '';
  customerName = '';
  boookingError = "";
  showBlur: boolean = true;
  selectedBookingRoom: any = null;
  bookedRooms: any[] = [];
  minDate: string = '';
  constructor(private bookingService: BookingService, private cdr: ChangeDetectorRef, private hotelService: HotelService) { }

  ngOnInit() {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    this.loadRooms();
    this.loadBookings();
  }

  loadBookings(): void {
    this.bookingService.getAllBooking().subscribe({
      next: (response) => {
        console.log(response);
        this.bookedRooms = response;
        this.showBlur = false;
        this.cdr.detectChanges();
      },
      error: (error) => console.log(error)
    });
  }
  getTotalDays(): number {
    if (!this.checkInDate || !this.checkOutDate) {
      return 0;
    }
    const checkIn = new Date(this.checkInDate);
    const checkOut = new Date(this.checkOutDate);
    checkIn.setHours(0, 0, 0, 0);
    checkOut.setHours(0, 0, 0, 0);
    const diffTime = checkOut.getTime() - checkIn.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  }
  getTotalPrice(room: any): number {
    return this.getTotalDays() * (room.price || 0);
  }
  getRoomNumber(roomId: string): string {
    const room = this.rooms.find(r => r.id === roomId);
    return room ? room.roomNumber : '—';
  }
  loadRooms() {
    this.bookingService.getAllRooms().subscribe({
      next: (res) => {
        this.rooms = res;
        this.cdr.detectChanges();
      },
      error: err => console.log(err)
    });
  }

  submitSearch() {
    this.submitError="";
    if (!this.checkInDate || !this.checkOutDate) {
      this.submitError='Check-in and Check-out dates are required';
      this.cdr.detectChanges();
      return;
    }
    const hotelId: any = localStorage.getItem('hotelId');
    const payload = { checkIn: this.checkInDate, checkOut: this.checkOutDate };
    this.hotelService.searchRooms(payload, hotelId).subscribe({
      next: (response) => {
        this.bookingRooms = response;
        this.cdr.detectChanges();
      },
      error: error => console.log(error)
    });
  }

  openBookModal(room: any) {
    this.selectedRoom = room;
    this.customerEmail = '';
    this.showModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.showModal = false;
    this.selectedRoom = null;
    document.body.style.overflow = 'auto';
  }
  checkIn(roomId: string, bookingId: string) {
    const payload = { checkIn: true };
    this.hotelService.checkInCheckOut(payload, roomId, bookingId).subscribe({
      next: (response) => {
        console.log(response);
        this.loadRooms();
        this.cdr.detectChanges();
      },
      error: error => console.log(error)
    });
    console.log(roomId);
  }
  checkOut(roomId: string, bookingId: string) {
    const payload = { checkIn: false };
    this.hotelService.checkInCheckOut(payload, roomId, bookingId).subscribe({
      next: (response) => {
        console.log(response);
        this.loadRooms();
        this.cdr.detectChanges();
      },
      error: error => console.log(error)
    });
    console.log(roomId);
  }
  confirmBooking() {
    if (!this.customerEmail.trim()) {
      this.boookingError = "Email is required";
      this.cdr.detectChanges();
      return;
    }
    if (!this.customerName.trim()) {
      this.boookingError = "Name is required";
      this.cdr.detectChanges();
      return;
    }
    const payload = {
      roomId: this.selectedRoom.id,
      guestName: this.customerName, guestEmail: this.customerEmail,
      checkInDate: this.checkInDate, checkOutDate: this.checkOutDate
    }
    const hotelId = localStorage.getItem('hotelId')!;
    this.bookingService.bookHotel(payload, hotelId).subscribe({
      next: (response) => {
        console.log(response);
        this.bookingRooms=[];
        this.loadBookings();
        this.cdr.detectChanges();
      },
      error: error => console.log(error)
    });
    this.closeModal();
  }
}

