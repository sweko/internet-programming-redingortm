import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  studentName: string = 'Erol Balkan'; 
  studentId: string = '2945'; 
  currentYear: number = new Date().getFullYear();
  githubRepo: string = 'https://github.com/sweko/internet-programming-redingortm'; // Replace with actual repo link
}
