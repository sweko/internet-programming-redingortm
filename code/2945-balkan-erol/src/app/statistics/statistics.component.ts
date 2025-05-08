import { Component, OnInit } from '@angular/core';
import { ApiService, Movie, Actor, Genre } from '../api.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  movies: Movie[] = [];
  actors: Actor[] = [];
  genres: Genre[] = [];

  totalMovies: number = 0;
  totalActors: number = 0;
  totalGenres: number = 0;
  totalOscars: number = 0;

  oscarsPerType: { [key: string]: number } = {};
  oscarsPerGenre: { [key: string]: number } = {};
  moviesPerDecade: { [key: string]: number } = {};
  moviesPerGenre: { [key: string]: number } = {};
  actorsWithoutDetails: Actor[] = [];
  moviesWithoutDetails: Movie[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.apiService.getMovies().subscribe(movies => {
      this.movies = movies;
      this.totalMovies = movies.length;
      this.calculateMoviesStats();
    });

    this.apiService.getActors().subscribe(actors => {
      this.actors = actors;
      this.totalActors = actors.length;
      this.actorsWithoutDetails = actors.filter(a => !a.birthdate || !a.height || !a.nationality);
    });

    this.apiService.getGenres().subscribe(genres => {
      this.genres = genres;
      this.totalGenres = genres.length;
    });
  }

  calculateMoviesStats(): void {
    this.totalOscars = 0;
    this.oscarsPerType = {};
    this.oscarsPerGenre = {};
    this.moviesPerDecade = {};
    this.moviesPerGenre = {};
    this.moviesWithoutDetails = [];

    this.movies.forEach(movie => {
      if (!movie.plot || !movie.director) {
        this.moviesWithoutDetails.push(movie);
      }

      const decade = Math.floor(movie.year / 10) * 10 + 's';
      this.moviesPerDecade[decade] = (this.moviesPerDecade[decade] || 0) + 1;

      movie.genre.forEach(g => {
        this.moviesPerGenre[g] = (this.moviesPerGenre[g] || 0) + 1;
      });

      Object.entries(movie.oscars).forEach(([type, recipient]) => {
        this.totalOscars++;
        this.oscarsPerType[type] = (this.oscarsPerType[type] || 0) + 1;
        movie.genre.forEach(g => {
          this.oscarsPerGenre[g] = (this.oscarsPerGenre[g] || 0) + 1;
        });
      });
    });
  }
}
