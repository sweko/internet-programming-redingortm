import { Component, OnInit } from '@angular/core';
import { MovieService } from '../movie.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css'
})
export class StatisticsComponent implements OnInit {
  totalMovies: number = 0;
  totalActors: number = 0;
  totalGenres: number = 0;
  totalOscars: number = 0;
  oscarsPerType: { [key: string]: number } = {};
  oscarsPerGenre: { [key: string]: number } = {};
  moviesPerDecade: { [key: string]: number } = {};
  moviesPerGenre: { [key: string]: number } = {};
  actorsWithoutDetails: number = 0;

  constructor(private movieService: MovieService) { }

  ngOnInit(): void {
    this.movieService.getMovies().subscribe(movies => {
      this.totalMovies = movies.length;
      this.totalActors = this.calculateTotalActors(movies);
      this.totalGenres = this.calculateTotalGenres(movies);
      this.totalOscars = this.calculateTotalOscars(movies);
      this.oscarsPerType = this.calculateOscarsPerType(movies);
      this.oscarsPerGenre = this.calculateOscarsPerGenre(movies);
      this.moviesPerDecade = this.calculateMoviesPerDecade(movies);
      this.moviesPerGenre = this.calculateMoviesPerGenre(movies);
      this.actorsWithoutDetails = this.calculateActorsWithoutDetails(movies);
    });
  }

  calculateTotalActors(movies: any[]): number {
    const actors = new Set<string>();
    movies.forEach(movie => {
      movie.cast.forEach((castMember: { actor: string; role: string }) => {
        actors.add(castMember.actor);
      });
    });
    return actors.size;
  }

  calculateTotalGenres(movies: any[]): number {
    const genres = new Set<string>();
    movies.forEach(movie => {
      movie.genre.forEach((genre: string) => {
        genres.add(genre);
      });
    });
    return genres.size;
  }

  calculateTotalOscars(movies: any[]): number {
    let totalOscars = 0;
    movies.forEach(movie => {
      if (movie.oscars) {
        totalOscars += Object.keys(movie.oscars).length;
      }
    });
    return totalOscars;
  }

  calculateOscarsPerType(movies: any[]): { [key: string]: number } {
    const oscarsPerType: { [key: string]: number } = {};
    movies.forEach(movie => {
      if (movie.oscars) {
        Object.keys(movie.oscars).forEach(type => {
          oscarsPerType[type] = (oscarsPerType[type] || 0) + 1;
        });
      }
    });
    return oscarsPerType;
  }

  calculateOscarsPerGenre(movies: any[]): { [key: string]: number } {
    const oscarsPerGenre: { [key: string]: number } = {};
    movies.forEach(movie => {
      if (movie.oscars) {
        movie.genre.forEach((genre: string) => {
          oscarsPerGenre[genre] = (oscarsPerGenre[genre] || 0) + Object.keys(movie.oscars).length;
        });
      }
    });
    return oscarsPerGenre;
  }

  calculateMoviesPerDecade(movies: any[]): { [key: string]: number } {
    const moviesPerDecade: { [key: string]: number } = {};
    movies.forEach(movie => {
      const decade = Math.floor(movie.year / 10) * 10;
      moviesPerDecade[decade] = (moviesPerDecade[decade] || 0) + 1;
    });
    return moviesPerDecade;
  }

  calculateMoviesPerGenre(movies: any[]): { [key: string]: number } {
    const moviesPerGenre: { [key: string]: number } = {};
    movies.forEach(movie => {
      movie.genre.forEach((genre: string) => {
        moviesPerGenre[genre] = (moviesPerGenre[genre] || 0) + 1;
      });
    });
    return moviesPerGenre;
  }

  calculateActorsWithoutDetails(movies: any[]): number {
    return 0;
  }
}
