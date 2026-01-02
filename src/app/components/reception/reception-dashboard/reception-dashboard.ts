import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../../services/booking';
import { HotelService } from '../../../services/hotels';

@Component({
  selector: 'app-reception-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reception-dashboard.html',
  styleUrl: './reception-dashboard.css',
})
export class ReceptionDashboard {
  checkInDate = '';
  checkOutDate = '';
  rooms: any[] = [];
  bookingRooms: any[] = [];

  showModal = false;
  selectedRoom: any = null;
  customerEmail = '';
  customerName = '';
  boookingError ="";
  selectedBookingRoom: any = null;
  bookedRooms: any[] = [];
  constructor(private bookingService: BookingService,private cdr: ChangeDetectorRef,private hotelService: HotelService) {}

  ngOnInit() {
    this.loadRooms();
    this.bookingService.getAllBooking().subscribe({
      next: (response) => {
        console.log(response);
        this.bookedRooms=response;
        this.cdr.detectChanges();
      },
      error: error => console.log(error)
    })
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
    if (!this.checkInDate || !this.checkOutDate) {
      console.log('Check-in and Check-out dates are required');
      return;
    }
    const hotelId: any = localStorage.getItem('hotelId');
    const payload = { checkIn: this.checkInDate, checkOut: this.checkOutDate };
    this.hotelService.searchRooms(payload, hotelId).subscribe({
      next: (response) => {
        console.log(response);
        this.bookingRooms = response;
        this.cdr.detectChanges();
      },
      error: error => console.log(error)
    });
    this.cdr.detectChanges();
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
  checkIn(roomId:string){
    console.log(roomId);
  }
  checkOut(roomId:string){
    console.log(roomId);
  }
  confirmBooking() {
    if (!this.customerEmail.trim()) {
      this.boookingError="Email is required"; 
      this.cdr.detectChanges();
      return;
    }
    if (!this.customerName.trim()) {
      this.boookingError="Name is required";
      this.cdr.detectChanges();
      return;
    }
    const payload={roomId:this.selectedRoom.id,
      guestName:this.customerName,guestEmail:this.customerEmail,
      checkInDate:this.checkInDate,checkOutDate:this.checkOutDate
    }
    const hotelId = localStorage.getItem('hotelId')!;
    this.bookingService.bookHotel(payload,hotelId).subscribe({
      next: (response) => {
        console.log(response);
        this.cdr.detectChanges();
      },
      error: error => console.log(error)
    });
    this.closeModal();
  }
}

