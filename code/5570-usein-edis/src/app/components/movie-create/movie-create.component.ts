import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { GenreService } from '../../services/genre.service';
import { Movie } from '../../models/movie.model';
import { Genre } from '../../models/genre.model';

@Component({
  selector: 'app-movie-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './movie-create.component.html',
  styleUrl: './movie-create.component.css'
})
export class MovieCreateComponent implements OnInit {
  movie: Movie = {
    id: 0,
    title: '',
    year: new Date().getFullYear(),
    director: '',
    genre: [],
    plot: '',
    cast: [],
    oscars: {},
    rating: 0
  };

  genres: Genre[] = [];
  selectedGenres: string[] = [];
  newOscarType: string = '';
  newOscarRecipient: string = '';

  // UI state
  isSubmitting: boolean = false;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private movieService: MovieService,
    private genreService: GenreService
  ) {}

  ngOnInit(): void {
    this.loadGenres();
    this.setNextId();
  }

  setNextId(): void {
    this.movieService.getNextId().subscribe({
      next: (nextId) => {
        this.movie.id = nextId;
      },
      error: (error) => {
        console.error('Error getting next ID', error);
        // Fallback to a random ID if there's an error
        this.movie.id = Math.floor(Math.random() * 10000) + 1;
      }
    });
  }

  loadGenres(): void {
    this.genreService.getGenres().subscribe({
      next: (genres) => {
        this.genres = genres;
      },
      error: (error) => {
        console.error('Error loading genres', error);
      }
    });
  }

  toggleGenre(genre: string): void {
    const index = this.selectedGenres.indexOf(genre);
    if (index === -1) {
      this.selectedGenres.push(genre);
    } else {
      this.selectedGenres.splice(index, 1);
    }
  }

  addOscar(): void {
    if (!this.newOscarType || !this.newOscarRecipient) {
      return;
    }

    if (!this.movie.oscars) {
      this.movie.oscars = {};
    }

    this.movie.oscars[this.newOscarType] = this.newOscarRecipient;
    this.newOscarType = '';
    this.newOscarRecipient = '';
  }

  removeOscar(oscarType: string): void {
    if (this.movie.oscars) {
      delete this.movie.oscars[oscarType];
    }
  }

  saveMovie(): void {
    // Validate required fields
    if (!this.movie.title) {
      this.errorMessage = 'Title is required';
      return;
    }

    if (!this.movie.year) {
      this.errorMessage = 'Year is required';
      return;
    }

    if (!this.movie.director) {
      this.errorMessage = 'Director is required';
      return;
    }

    if (this.selectedGenres.length === 0) {
      this.errorMessage = 'At least one genre must be selected';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.movie.genre = [...this.selectedGenres];

    this.movieService.createMovie(this.movie).subscribe({
      next: (createdMovie) => {
        // Add a 1-second delay before navigating
        setTimeout(() => {
          this.isSubmitting = false;
          this.router.navigate(['/movies']);
        }, 1000);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = 'Error creating movie: ' + (error.message || 'Unknown error');
        console.error('Error creating movie', error);
      }
    });
  }

  formatOscarName(oscarType: string): string {
    // Convert camelCase to Title Case with spaces
    return oscarType
      .replace(/([A-Z])/g, ' $1') // Insert a space before all uppercase letters
      .replace(/^./, (str) => str.toUpperCase()); // Uppercase the first letter
  }

  hasOscars(oscars: { [key: string]: string }): boolean {
    return Object.keys(oscars).length > 0;
  }
}
