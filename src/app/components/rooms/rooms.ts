import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HotelService } from '../../services/hotels';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rooms',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './rooms.html',
  styleUrl: './rooms.css',
})
export class Rooms {
  hotelId!: string;
  checkIn!: string;
  checkOut!: string;
  rooms: any[] = [];
  constructor(private route: ActivatedRoute, private hotelService: HotelService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.hotelId = this.route.snapshot.paramMap.get('hotelId')!;

    // Read checkIn and checkOut from query params
    this.checkIn = this.route.snapshot.queryParamMap.get('checkIn')!;
    this.checkOut = this.route.snapshot.queryParamMap.get('checkOut')!;

    console.log('Hotel ID:', this.hotelId);
    console.log('Check-in:', this.checkIn);
    console.log('Check-out:', this.checkOut);
    this.hotelService.searchRooms({ "checkIn": this.checkIn, "checkOut": this.checkOut }, this.hotelId).subscribe({
      next: (response) => {
        console.log(response);
        this.rooms = response;
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
  }

}
