import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HotelService } from '../../../services/hotels';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {
  hotelName = '';
  city = '';
  address = '';
  roomCount!: number;

  hotels: any[] = [];

  constructor(private hotelService: HotelService,private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadHotels();
  }

  loadHotels() {
    this.hotelService.getAllHotelAdmin().subscribe({
      next: (response) => {
        this.hotels = response;
        this.cdr.detectChanges();
      },
      error: (error) => console.error(error),
    });
  }

  submit() {
    console.log({
      hotelName: this.hotelName,
      city: this.city,
      address: this.address,
      roomCount: this.roomCount,
    });
  }

  addManager(hotelId: string) {
    console.log('Add manager for hotel:', hotelId);
  }

  deleteHotel(hotelId: string) {
    console.log('Delete hotel:', hotelId);
  }
}
