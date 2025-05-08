import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import * as movieData from '../../db/movie-data.json';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private movies: any[] = (movieData as any).movies;
  private genres: any[] = (movieData as any).genres;
  private actors: any[] = (movieData as any).actors;

  constructor() { }

  getMovies(): Observable<any[]> {
    return of(this.movies);
  }

  getMovie(id: number): Observable<any> {
    const movie = this.movies.find(m => m.id === id);
    return of(movie);
  }

  createMovie(movie: any): Observable<any> {
    movie.id = this.movies.length + 1;
    this.movies.push(movie);
    return of(movie);
  }

  updateMovie(id: number, movie: any): Observable<any> {
    const index = this.movies.findIndex(m => m.id === id);
    this.movies[index] = movie;
    return of(movie);
  }

  deleteMovie(id: number): Observable<any> {
    this.movies = this.movies.filter(m => m.id !== id);
    return of(null);
  }

  getGenres(): Observable<any[]> {
    return of(this.genres);
  }

  getActors(): Observable<any[]> {
    return of(this.actors);
  }

  getActor(id: number): Observable<any> {
    const actor = this.actors.find(a => a.id === id);
    return of(actor);
  }

  getActorByName(name: string): Observable<any> {
    const actor = this.actors.find(a => a.name === name);
    return of(actor);
  }
}
