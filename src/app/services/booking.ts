import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private URL1 = 'http://localhost:8008/hotel-service/rooms';
  private URL2 = 'http://localhost:8008/booking-service/api/booking/booking';
  private URL3 = 'http://localhost:8008/booking-service/api/booking';

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
  bookHotel(payload:any,hotelId:string){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({Authorization: `Bearer ${token}`});
    return this.http.post(`${this.URL3}/${hotelId}`,payload,{headers});
  }
  getUserHotel(){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({Authorization: `Bearer ${token}`});
    const email = localStorage.getItem('email');
    return this.http.get<any[]>(`${this.URL3}/${email}/all`,{headers});
  }
  updateUserHotel(payload:any,resevationId:string){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({Authorization: `Bearer ${token}`});
    const email = localStorage.getItem('email');
    return this.http.put(`${this.URL3}/${email}/${resevationId}/update`,payload,{headers});
  }
  cancelUserHotel(resevationId:string){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({Authorization: `Bearer ${token}`});
    const email = localStorage.getItem('email');
    return this.http.delete(`${this.URL3}/${email}/${resevationId}/cancel`,{headers});
  }
}
