import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../services/movie.service';
import { GenreService } from '../../services/genre.service';
import { Movie } from '../../models/movie.model';
import { Genre } from '../../models/genre.model';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.css'
})
export class MovieListComponent implements OnInit {
  movies: Movie[] = [];
  filteredMovies: Movie[] = [];
  genres: Genre[] = [];

  // Sorting
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Filtering
  titleFilter: string = '';
  yearFilter: number | null = null;
  genreFilter: string = '';
  ratingFilter: number | null = null;

  // Feedback
  successMessage: string = '';

  constructor(
    private movieService: MovieService,
    private genreService: GenreService
  ) {}

  ngOnInit(): void {
    this.loadMovies();
    this.loadGenres();
  }

  loadMovies(): void {
    this.movieService.getMovies().subscribe({
      next: (movies) => {
        this.movies = movies;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error loading movies', error);
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

  applyFilters(): void {
    this.filteredMovies = this.movies.filter(movie => {
      // Title filter
      if (this.titleFilter && !movie.title.toLowerCase().includes(this.titleFilter.toLowerCase())) {
        return false;
      }

      // Year filter
      if (this.yearFilter && movie.year !== this.yearFilter) {
        return false;
      }

      // Genre filter
      if (this.genreFilter && !movie.genre.includes(this.genreFilter)) {
        return false;
      }

      // Rating filter
      if (this.ratingFilter && movie.rating && movie.rating < this.ratingFilter) {
        return false;
      }

      return true;
    });

    // Apply sorting
    if (this.sortColumn) {
      this.sortMovies(this.sortColumn);
    }
  }

  sortMovies(column: string): void {
    if (this.sortColumn === column) {
      // Toggle sort direction
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredMovies.sort((a, b) => {
      let comparison = 0;

      switch (column) {
        case 'id':
          comparison = a.id - b.id;
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'year':
          comparison = a.year - b.year;
          break;
        case 'director':
          comparison = a.director.localeCompare(b.director);
          break;
        case 'genre':
          // Sort by number of genres, then by first genre
          comparison = a.genre.length - b.genre.length;
          if (comparison === 0 && a.genre.length > 0 && b.genre.length > 0) {
            comparison = a.genre[0].localeCompare(b.genre[0]);
          }
          break;
        case 'oscars':
          const aOscars = a.oscars ? Object.keys(a.oscars).length : 0;
          const bOscars = b.oscars ? Object.keys(b.oscars).length : 0;
          comparison = aOscars - bOscars;
          break;
        case 'rating':
          const aRating = a.rating || 0;
          const bRating = b.rating || 0;
          comparison = aRating - bRating;
          break;
      }

      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  deleteMovie(id: number): void {
    if (confirm('Are you sure you want to delete this movie?')) {
      // Find the movie title before deleting
      const movieToDelete = this.movies.find(movie => movie.id === id);
      const movieTitle = movieToDelete ? movieToDelete.title : 'Movie';

      this.movieService.deleteMovie(id).subscribe({
        next: () => {
          this.movies = this.movies.filter(movie => movie.id !== id);
          this.applyFilters();
          this.successMessage = `"${movieTitle}" has been successfully deleted.`;

          // Auto-dismiss the message after 5 seconds
          setTimeout(() => {
            this.successMessage = '';
          }, 5000);
        },
        error: (error) => {
          console.error('Error deleting movie', error);
        }
      });
    }
  }

  getOscarsCount(movie: Movie): number {
    return movie.oscars ? Object.keys(movie.oscars).length : 0;
  }

  formatGenres(genres: string[]): string {
    return genres.join(' / ');
  }
}
