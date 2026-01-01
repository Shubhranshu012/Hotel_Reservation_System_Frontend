import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  city = '';
  checkIn = '';
  checkOut = '';
  rooms = '';

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }
  images = [
    'img1.jpg',
    'img2.jpg',
    'img3.jpg',
    'img4.jpg',
    'img5.jpg'
  ];
  currentIndex = 0;

  ngOnInit(): void {
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
      this.cdr.detectChanges();
    }, 15000);
  }
  search() {
    this.router.navigate(['/hotels'], {
      queryParams: {
        city: this.city,
        checkIn: this.checkIn,
        checkOut: this.checkOut,
        rooms: this.rooms
      }
    });
  }
}
