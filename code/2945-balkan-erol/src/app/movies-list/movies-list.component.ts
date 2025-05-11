import { Component, OnInit } from '@angular/core';
import { ApiService, Movie, Genre } from '../api.service';

@Component({
  selector: 'app-movies-list',
  templateUrl: './movies-list.component.html',
  styleUrls: ['./movies-list.component.css']
})
export class MoviesListComponent implements OnInit {
  movies: Movie[] = [];
  filteredMovies: Movie[] = [];
  genres: Genre[] = [];

  // Filters
  filterTitle: string = '';
  filterYear: number | null = null;
  filterGenre: string = '';
  filterRating: number | null = null;

  // Sorting
  sortColumn: string = 'id';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadGenres();
    this.loadMovies();
  }

  loadGenres(): void {
    this.apiService.getGenres().subscribe(genres => {
      this.genres = genres;
    });
  }

  loadMovies(): void {
    this.apiService.getMovies().subscribe(movies => {
      this.movies = movies;
      this.applyFilters();
    });
  }

  applyFilters(): void {
    this.filteredMovies = this.movies.filter(movie => {
      const matchesTitle = this.filterTitle ? movie.title.toLowerCase().includes(this.filterTitle.toLowerCase()) : true;
      const matchesYear = this.filterYear ? movie.year === this.filterYear : true;
      const matchesGenre = this.filterGenre ? movie.genre.includes(this.filterGenre) : true;
      const matchesRating = this.filterRating ? movie.rating >= this.filterRating : true;
      return matchesTitle && matchesYear && matchesGenre && matchesRating;
    });
    this.applySort();
  }

  applySort(): void {
    this.filteredMovies.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (this.sortColumn) {
        case 'id':
          aValue = a.id;
          bValue = b.id;
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'year':
          aValue = a.year;
          bValue = b.year;
          break;
        case 'director':
          aValue = a.director.toLowerCase();
          bValue = b.director.toLowerCase();
          break;
        case 'genre':
          // Sort by number of genres, then alphabetically ignoring order
          const aGenres = [...a.genre].sort();
          const bGenres = [...b.genre].sort();
          if (aGenres.length !== bGenres.length) {
            return this.sortDirection === 'asc' ? aGenres.length - bGenres.length : bGenres.length - aGenres.length;
          }
          for (let i = 0; i < aGenres.length; i++) {
            if (aGenres[i] !== bGenres[i]) {
              return this.sortDirection === 'asc' ? aGenres[i].localeCompare(bGenres[i]) : bGenres[i].localeCompare(aGenres[i]);
            }
          }
          return 0;
        case 'oscars':
          aValue = Object.keys(a.oscars).length;
          bValue = Object.keys(b.oscars).length;
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        default:
          aValue = a.id;
          bValue = b.id;
      }

      if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  setSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applySort();
  }

  getSortArrow(column: string): string {
    if (this.sortColumn !== column) return '';
    return this.sortDirection === 'asc' ? '▲' : '▼';
  }

  deleteMovie(id: number): void {
    if (confirm('Are you sure you want to delete this movie?')) {
      this.apiService.deleteMovie(id).subscribe(() => {
        this.loadMovies();
      });
    }
  }
}
