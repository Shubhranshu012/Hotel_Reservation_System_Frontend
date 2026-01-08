import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HotelService } from '../../../services/hotels';
import { CommonModule } from '@angular/common';
import { Auth } from '../../../services/auth';
import { Router } from '@angular/router';
import { Password } from '../../../services/password';
import { Loader } from '../../loader/loader';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule,Loader],
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
  managerConfirmPassword = '';
  managerError = '';
  showBlur: boolean = true;
  successMessage:string=""
  successHotel:string="";
  constructor(private passwordService: Password, private router: Router, private hotelService: HotelService, private cdr: ChangeDetectorRef, private authService: Auth) { }

  ngOnInit(): void {
    if (localStorage.getItem('role') != "ADMIN") {
      this.router.navigate(["login"]);
    }
    this.loadHotels();
  }

  loadHotels() {
    this.hotelService.getAllHotelAdmin().subscribe({
      next: (response) => {
        this.hotels = response;
        console.log(response);
        this.cdr.detectChanges();
      },
      error:(error)=>{
        console.log(error);
      }
    });
    this.showBlur=false;
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
    if(this.managerEmail.trim().length<=0){
      this.managerError="Email is Required";
      this.cdr.detectChanges();
      return;
    }
    const validate = this.passwordService.validate(this.managerPassword);
    if (this.managerConfirmPassword !== this.managerPassword) {
      this.managerError = "Confirm Password Not Same";
      this.cdr.detectChanges();
      return;
    }
    if (validate == null) {
      this.showBlur=true;
      const payload = { hotelId: this.selectedHotelId, email: this.managerEmail, password: this.managerPassword, confirmPassword: this.managerConfirmPassword };
      this.authService.registerManager(payload, this.selectedHotelId).subscribe({
        next: () => {
          this.showBlur=false;
          this.managerError="";
          this.successMessage = "Manager Added successful!";
          this.cdr.detectChanges();
          this.closeModals();
          setTimeout(() => {
              this.closeModals();
              this.cdr.detectChanges();
          }, 2000);
        },
        error: (error) => {
          console.error(error);
          this.managerError = error.error.error;
          this.showBlur=false;
          this.cdr.detectChanges();

        }
      });
    }
    else {
      this.managerError = validate;
      this.cdr.detectChanges();
      return;
    }
  }

  deleteHotel() {
    if (!this.selectedHotelId) return;
    this.showBlur=true;
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
    this.hotelName=this.hotelName.trim();
    if (this.city.trim().length === 0) {
      this.hotelError = 'City is required';
      return;
    }

    if (this.address.trim().length === 0) {
      this.hotelError = 'Address is required';
      return;
    }

    if (this.roomCount < 0) {
      this.hotelError = 'Room Count must be greater than 0';
      return;
    }
    this.showBlur=true;
    const payload = { hotelName: this.hotelName, city: this.city, address: this.address, numberOfRooms: this.roomCount };
    this.hotelService.addHotel(payload).subscribe({
      next: () => {
        console.log("Added Hotel");
        this.successHotel="Hotel Added";
        this.cdr.detectChanges();
        this.loadHotels();
      },
      error: (error) => {
        console.error(error);
        this.showBlur=false;
        this.hotelError =error.error.error;
        this.cdr.detectChanges();

      }
    })
  }
}
