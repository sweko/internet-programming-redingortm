import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule, RouterOutlet } from '@angular/router';
import { delay, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  // This file should be refactored, feel free to move the code around, copy the code to new files, or delete it altogether.
  currentYear: number = 0;

  welcomeMessage = 'Welcome to the Movie Management System!';
  statusMessage = 'Checking data connection...';

  routes = [
    { linkName: 'Movies' , url: '/movies' },
    { linkName: 'Statistics', url: '/statistics' },
    { linkName: 'About', url: '/about' }
  ];

  private dataTest: Observable<any>;

  // Should this http be here or in a separate file?
  constructor(private http: HttpClient) { 
    this.dataTest = this.http.get('http://localhost:3000', {responseType: "text"}).pipe(delay(1000), takeUntilDestroyed());
  }


  ngOnInit() {
    this.currentYear = new Date().getFullYear();

    this.dataTest.subscribe({
      next: _ => {
        this.statusMessage = 'Data connection is working!';
      },
      error: (error) => {
        this.statusMessage = `Data connection failed (see console for details)! ${error.message}`;
        console.error(error);
      }
    });
  }

}
