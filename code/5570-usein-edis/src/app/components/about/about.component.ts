import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  studentName: string = 'Erol Balkan';
  studentId: string = '2945';
  currentYear: number = new Date().getFullYear();
  githubRepo: string = 'https://github.com/ErolBalkan';
}
