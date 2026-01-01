import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  
  private URL = 'http://localhost:8001/AUTHSERVICE/auth';

  constructor(private http: HttpClient) {}
  register(payload: {email: string,password: string,role: string}): Observable<any> {
    return this.http.post(`${this.URL}/register`, payload);
  }

  login(payload:{email: string,password: string}): Observable<any>{
    return this.http.post(`${this.URL}/login`, payload);
  }
}
