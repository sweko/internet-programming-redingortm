import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie, Genre, Actor } from '../models.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // ===== MOVIES =====

  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.baseUrl}/movies`);
  }

  getMovie(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.baseUrl}/movies/${id}`);
  }

  createMovie(movie: Movie): Observable<Movie> {
    return this.http.post<Movie>(`${this.baseUrl}/movies`, movie);
  }

  updateMovie(id: number, movie: Movie): Observable<Movie> {
    return this.http.put<Movie>(`${this.baseUrl}/movies/${id}`, movie);
  }

  deleteMovie(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/movies/${id}`);
  }

  // ===== GENRES =====

  getGenres(): Observable<Genre[]> {
    return this.http.get<Genre[]>(`${this.baseUrl}/genres`);
  }

  // ===== ACTORS =====

  getActors(): Observable<Actor[]> {
    return this.http.get<Actor[]>(`${this.baseUrl}/actors`);
  }

  getActor(id: number): Observable<Actor> {
    return this.http.get<Actor>(`${this.baseUrl}/actors/${id}`);
  }

  getActorByName(name: string): Observable<Actor[]> {
    return this.http.get<Actor[]>(`${this.baseUrl}/actors?name=${encodeURIComponent(name)}`);
  }
}
