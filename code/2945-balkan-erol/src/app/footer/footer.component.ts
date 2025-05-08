import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();
  studentId: string = 'YourStudentID'; // Replace with actual student ID
  studentName: string = 'Your Name'; // Replace with actual student name
}
