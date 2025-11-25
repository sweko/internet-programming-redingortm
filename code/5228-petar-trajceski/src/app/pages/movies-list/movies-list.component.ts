import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models.model';

@Component({
  selector: 'app-movies-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movies-list.component.html',
  styleUrls: ['./movies-list.component.css']
})
export class MoviesListComponent implements OnInit {

  movies: Movie[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private movieService: MovieService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies() {
    this.isLoading = true;
    this.movieService.getMovies().subscribe({
      next: (data) => {
        this.movies = data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load movies.';
        this.isLoading = false;
      }
    });
  }

  view(movie: Movie) {
    this.router.navigate(['/movies', movie.id]);
  }

  edit(movie: Movie) {
    this.router.navigate(['/movies', movie.id, 'edit']);
  }

  delete(movie: Movie) {
    if (!confirm(`Delete "${movie.title}" ?`)) return;

    this.movieService.deleteMovie(movie.id).subscribe({
      next: () => this.loadMovies(),
      error: () => alert('Error deleting movie.')
    });
  }

  create() {
    this.router.navigate(['/movies', 'create']);
  }

  getOscarCount(movie: Movie): number {
    return movie.oscars ? Object.keys(movie.oscars).length : 0;
  }
}
