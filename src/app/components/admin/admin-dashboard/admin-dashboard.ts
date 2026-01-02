import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HotelService } from '../../../services/hotels';
import { CommonModule } from '@angular/common';
import { Auth } from '../../../services/auth';
import { Router } from '@angular/router';

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
  roomCount: number = 0;
  hotelError: string = "";
  hotels: any[] = [];

  showManagerModal = false;
  showDeleteModal = false;
  selectedHotelId: string | null = null;

  managerEmail = '';
  managerPassword = '';

  constructor(private router:Router,private hotelService: HotelService, private cdr: ChangeDetectorRef,private authService:Auth) { }

  ngOnInit(): void {
    if(localStorage.getItem('role') != "ADMIN"){
      this.router.navigate(["login"]);
    }
    this.loadHotels();
  }

  loadHotels() {
    this.hotelService.getAllHotelAdmin().subscribe({
      next: (res) => {
        this.hotels = res;
        this.cdr.detectChanges();
      }
    });
  }

  openAddManager(hotelId: string) {
    this.selectedHotelId = hotelId;
    this.showManagerModal = true;
  }

  openDeleteHotel(hotelId: string) {
    this.selectedHotelId = hotelId;
    this.showDeleteModal = true;
  }

  closeModals() {
    this.showManagerModal = false;
    this.showDeleteModal = false;
    this.managerEmail = '';
    this.managerPassword = '';
    this.selectedHotelId = null;
  }

  addManager() {
    if (!this.selectedHotelId) return;

    const payload = { hotelId: this.selectedHotelId,email: this.managerEmail,password: this.managerPassword,};
    this.authService.registerManager(payload,this.selectedHotelId).subscribe({
      next: () => {
        console.log("Manager Added");
        this.loadHotels();
        this.closeModals();
      },
      error: (err) => {
        console.error(err);
        this.closeModals();
      }
    });
  }

  deleteHotel() {
    if (!this.selectedHotelId) return;

    this.hotelService.deleteHotel(this.selectedHotelId).subscribe({
      next: () => {
        console.log('Deleted hotel:', this.selectedHotelId);
        this.loadHotels();
        this.closeModals();
      },
      error: (err) => {
        console.error(err);
        this.closeModals();
      }
    });
  }

  onSubmit() {
    this.hotelError = ''; 

    if (this.hotelName.trim().length === 0) {
      this.hotelError = 'Hotel Name is required';
      return;
    }

    if (this.city.trim().length === 0) {
      this.hotelError = 'City is required';
      return;
    }

    if (this.address.trim().length === 0) {
      this.hotelError = 'Address is required';
      return;
    }

    if (this.roomCount <= 0) {
      this.hotelError = 'Room Count must be greater than 0';
      return;
    }
    const payload = {hotelName: this.hotelName,city: this.city,address: this.address,numberOfRooms: this.roomCount};
    this.hotelService.addHotel(payload).subscribe({
      next: () => {
        console.log("Added Hotel");
        this.loadHotels();
      },
      error: (err) => {
        console.error(err);
      }
    })
  }
}
