import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private URL1 = 'http://localhost:8008/hotel-service/rooms';
  private URL2 = 'http://localhost:8008/booking-service/api/booking/booked-rooms';
  


  constructor(private http: HttpClient) {}
  getAllRooms(){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({Authorization: `Bearer ${token}`});
    const hotelId=localStorage.getItem('hotelId');
    return this.http.get<any[]>(`${this.URL1}/${hotelId}`,{headers});
  }
  getAllBooking(){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({Authorization: `Bearer ${token}`});
    const hotelId=localStorage.getItem('hotelId');
    return this.http.get<any[]>(`${this.URL2}/${hotelId}`,{headers});
  }
}
