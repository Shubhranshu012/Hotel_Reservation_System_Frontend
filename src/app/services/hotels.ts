import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HotelService {
  private URL1 = 'http://localhost:8008/hotel-service/search';
  private URL2 = 'http://localhost:8008/hotel-service/hotel'
  private URL3 = 'http://localhost:8008/hotel-service/hotel/all'
  
  constructor(private http: HttpClient) {}
  searchHotel(payload : any){
    return this.http.post<any[]>(`${this.URL1}`, payload);
  }
  searchRooms(payload : any,hotelId:string){
    return this.http.post<any[]>(`${this.URL2}/${hotelId}/rooms/available`, payload);
  }
  getAllHotelAdmin(){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({Authorization: `Bearer ${token}`});
    return this.http.get<any[]>(`${this.URL3}`,{headers});
  }
}
