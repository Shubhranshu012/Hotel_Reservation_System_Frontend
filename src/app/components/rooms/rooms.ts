import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelService } from '../../services/hotels';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../services/booking';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rooms.html',
  styleUrl: './rooms.css',
})
export class Rooms {
  hotelId!: string;
  checkIn!: string;
  checkOut!: string;
  rooms: any[] = [];
  constructor(private route: ActivatedRoute,private bookingService:BookingService ,private hotelService: HotelService, private cdr: ChangeDetectorRef, private router: Router) { }

  ngOnInit(): void {
    this.hotelId = this.route.snapshot.paramMap.get('hotelId')!;
    this.checkIn = this.route.snapshot.queryParamMap.get('checkIn')!;
    this.checkOut = this.route.snapshot.queryParamMap.get('checkOut')!;

    console.log('Hotel ID:', this.hotelId);
    console.log('Check-in:', this.checkIn);
    console.log('Check-out:', this.checkOut);
    this.hotelService.searchRooms({ "checkIn": this.checkIn, "checkOut": this.checkOut }, this.hotelId).subscribe({
      next: (response) => {
        console.log(response);
        this.rooms = response;
        this.rooms = this.rooms.filter(
          room => room.status === 'AVAILABLE'
        );
        this.cdr.detectChanges();
      },
      error: error => {
        console.log(error);
        this.cdr.detectChanges();
      }
    });
  }
  bookRoom(roomId: string) {
    console.log('Booked Room ID:', roomId);
    const token = localStorage.getItem('token');
    if (!token) {
      localStorage.setItem('redirectAfterLogin', this.router.url);
      this.router.navigate(["/login"])
    }
    console.log("LogedIn");
    /*
    this.bookingService.bookHotel().subscribe({
      next: (response) => {
        console.log(response);
        this.rooms = response;
        this.rooms = this.rooms.filter(
          room => room.status === 'AVAILABLE'
        );
        this.cdr.detectChanges();
      },
      error: error => {
        console.log(error);
        this.cdr.detectChanges();
      }
    })
    */
  }

}
