import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelService } from '../../services/hotels';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../services/booking';
import { Loader } from '../loader/loader';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [CommonModule, Loader, FormsModule],
  templateUrl: './rooms.html',
  styleUrl: './rooms.css',
})
export class Rooms implements OnInit {
  hotelId!: string;
  checkIn!: string;
  checkOut!: string;
  rooms: any[] = [];
  filteredRooms: any[] = [];
  showBlur: boolean = true;
  roomTypes: string[] = [];
  selectedType: string = '';
  maxPrice: number = 0;
  highestPrice: number = 0;

  // Modal state
  showBookingModal: boolean = false;
  roomToBook: any = null;

  constructor(private route: ActivatedRoute, private bookingService: BookingService, private hotelService: HotelService, private cdr: ChangeDetectorRef, private router: Router) { }

  ngOnInit(): void {
    this.hotelId = this.route.snapshot.paramMap.get('hotelId')!;
    this.checkIn = this.route.snapshot.queryParamMap.get('checkIn')!;
    this.checkOut = this.route.snapshot.queryParamMap.get('checkOut')!;

    this.hotelService.searchRooms({ checkIn: this.checkIn, checkOut: this.checkOut }, this.hotelId)
      .subscribe({
        next: (response) => {
          this.rooms = response.filter(room => room.status === 'AVAILABLE');
          this.filteredRooms = [...this.rooms];
          this.roomTypes = [...new Set(this.rooms.map(room => room.type))];
          this.highestPrice = Math.max(0, ...this.rooms.map(room => +room.price || 0));
          this.maxPrice = this.highestPrice;
          this.selectedType = '';
          this.showBlur = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
          this.showBlur = false;
          this.cdr.detectChanges();
        }
      });
  }

  filterRooms() {
    this.filteredRooms = this.rooms.filter(room => {
      const typeMatch = this.selectedType ? room.type === this.selectedType : true;
      const priceMatch = room.price !== null && room.price <= this.maxPrice;
      return typeMatch && priceMatch;
    });
    this.cdr.detectChanges();
  }
  getTotalDays(): number {
    if (!this.checkIn || !this.checkOut) {
      return 0;
    }
    const checkIn = new Date(this.checkIn);
    const checkOut = new Date(this.checkOut);
    checkIn.setHours(0, 0, 0, 0);
    checkOut.setHours(0, 0, 0, 0);
    const diffTime = checkOut.getTime() - checkIn.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  }
  getTotalPrice(room: any): number {
    return this.getTotalDays() * (room.price || 0);
  }
  confirmBooking(room: any) {
    this.roomToBook = room;
    this.showBookingModal = true;
  }

  cancelBooking() {
    this.roomToBook = null;
    this.showBookingModal = false;
  }

  bookRoom() {
    if (!this.roomToBook) return;

    const token = localStorage.getItem('token');
    if (!token) {
      localStorage.setItem('redirectAfterLogin', this.router.url);
      this.router.navigate(['/login']);
      return;
    }

    const payload = {roomId: this.roomToBook.id,
      guestName: "User",guestEmail: localStorage.getItem('email'),
      checkInDate: this.checkIn,checkOutDate: this.checkOut};
    this.showBlur=true;
    this.bookingService.bookHotel(payload, this.roomToBook.hotelId).subscribe({
      next: (response) => {
        console.log('Booking successful', response);
        this.showBlur=false;
        this.showBookingModal = false;
        this.router.navigate(['/user/dashboard']);
      },
      error: (error) => {
        console.log(error);
        this.cdr.detectChanges();
      }
    });
  }
}

