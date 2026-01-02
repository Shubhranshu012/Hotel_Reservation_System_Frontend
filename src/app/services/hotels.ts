import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HotelService {
  private URL1 = 'http://localhost:8008/hotel-service/search';
  private URL2 = 'http://localhost:8008/hotel-service/hotel'
  private URL3 = 'http://localhost:8008/hotel-service/hotel/all'
  private URL4 = 'http://localhost:8008/hotel-service/hotel'
  private URL5 = 'http://localhost:8008/hotel-service/hotel'
  private URL6 = 'http://localhost:8008/hotel-service'

  constructor(private http: HttpClient) {}
  searchHotel(payload : any){
    return this.http.post<any[]>(`${this.URL1}`, payload);
  }
  searchRooms(payload : any,hotelId:string){
    return this.http.post<any[]>(`${this.URL2}/${hotelId}/rooms/available`, payload);
  }
  addHotel(payload:any){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({Authorization: `Bearer ${token}`});
    return this.http.post(`${this.URL5}`, payload,{headers});
  }
  getAllHotelAdmin(){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({Authorization: `Bearer ${token}`});
    return this.http.get<any[]>(`${this.URL3}`,{headers});
  }
  deleteHotel(hotelId:string){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({Authorization: `Bearer ${token}`});
    return this.http.delete(`${this.URL4}/${hotelId}`,{headers});
  }
  addRoom(payload:any){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({Authorization: `Bearer ${token}`});
    const hotelId=localStorage.getItem('hotelId');
    return this.http.post(`${this.URL4}/${hotelId}/room`,payload,{headers});
  }
  checkInCheckOut(payload:any,roomId:string){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({Authorization: `Bearer ${token}`});
    const hotelId=localStorage.getItem('hotelId');
    return this.http.put(`${this.URL6}/${hotelId}/rooms/${roomId}`,payload,{headers});
  }
}
