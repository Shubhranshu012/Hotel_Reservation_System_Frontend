import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelService } from '../../services/hotels';
import { CommonModule } from '@angular/common';
import { Loader } from '../loader/loader';

@Component({
  selector: 'app-hotels',
  standalone:true,
  imports: [CommonModule,Loader],
  templateUrl: './hotels.html',
  styleUrl: './hotels.css',
})
export class Hotels {
  city!: string;
  checkIn!: Date;
  checkOut!: Date; 
  roomCount!: number;
  errorMessage:string="";
  hotels: any[] = [];
  showBlur: boolean = true;
  constructor(private route: ActivatedRoute, private hotelService:HotelService, private cdr: ChangeDetectorRef ,private router:Router) {}

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.city = params['city'];
      this.checkIn = params['checkIn'];
      this.checkOut = params['checkOut'];
      this.roomCount = params['rooms'];
      console.log(this.city);
      this.hotelService.searchHotel({"city":this.city,"checkIn":this.checkIn,"checkOut":this.checkOut,"roomCount":this.roomCount}).subscribe({
        next: (response) => {
          console.log(response);
          this.hotels = response;
          this.showBlur=false;
          this.cdr.detectChanges();
        },
        error: error => {
          console.log(error);
          this.cdr.detectChanges();
        }
      });
    });
  }
  rooms(hotelId:string){
    console.log(hotelId);
    this.router.navigate([`rooms/${hotelId}`], {
    queryParams: {
      checkIn: this.checkIn,   
      checkOut: this.checkOut
    }
  })
  }
}
