import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { GenreService } from '../../services/genre.service';
import { Movie } from '../../models/movie.model';
import { Genre } from '../../models/genre.model';

@Component({
  selector: 'app-movie-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './movie-edit.component.html',
  styleUrl: './movie-edit.component.css'
})
export class MovieEditComponent implements OnInit {
  movie: Movie | null = null;
  genres: Genre[] = [];
  selectedGenres: string[] = [];
  newOscarType: string = '';
  newOscarRecipient: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService,
    private genreService: GenreService
  ) {}

  ngOnInit(): void {
    this.loadGenres();
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadMovie(id);
  }

  loadMovie(id: number): void {
    this.movieService.getMovie(id).subscribe({
      next: (movie) => {
        this.movie = movie;
        this.selectedGenres = [...movie.genre];
      },
      error: (error) => {
        console.error('Error loading movie', error);
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

    if (!this.movie) {
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
    if (this.movie?.oscars) {
      delete this.movie.oscars[oscarType];
    }
  }

  saveMovie(): void {
    if (this.movie) {
      this.movie.genre = [...this.selectedGenres];

      this.movieService.updateMovie(this.movie).subscribe({
        next: (updatedMovie) => {
          this.router.navigate(['/movies', updatedMovie.id]);
        },
        error: (error) => {
          console.error('Error updating movie', error);
        }
      });
    }
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
