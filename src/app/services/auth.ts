import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  
  private URL1 = 'http://localhost:8008/auth-service/auth/register';
  private URL2 = 'http://localhost:8008/auth-service/auth/login'

  constructor(private http: HttpClient) {}
  register(payload: {email: string,password: string,role: string}): Observable<any> {
    return this.http.post(`${this.URL1}`, payload);
  }

  login(payload:{email: string,password: string}): Observable<any>{
    return this.http.post(`${this.URL2}`, payload);
  }
  registerManager(payload:any,hotelId:string){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({Authorization: `Bearer ${token}`});
    return this.http.post(`${this.URL1}/manager/${hotelId}`, payload,{headers});
  }
  registerReceptionist(payload:any,hotelId:string){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({Authorization: `Bearer ${token}`});
    return this.http.post(`${this.URL1}/receptionist/${hotelId}`, payload,{headers});
  }
}
