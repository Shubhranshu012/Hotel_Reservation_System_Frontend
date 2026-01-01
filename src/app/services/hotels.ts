import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HotelService {
  private URL1 = 'http://localhost:8008/hotel-service/search';
  private URL2 = 'http://localhost:8008/hotel-service/auth/login'
  
  constructor(private http: HttpClient) {}
  searchHotel(payload : any){
    return this.http.post<any[]>(`${this.URL1}`, payload);
  }
}
