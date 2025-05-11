import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Movie {
  id: number;
  title: string;
  year: number;
  director: string;
  genre: string[];
  plot: string;
  cast: { actor: string; character: string }[];
  oscars: { [key: string]: string };
  rating: number;
}

export interface Genre {
  id: string;
  name: string;
}

export interface Actor {
  id: number;
  name: string;
  birthdate: string;
  height: number;
  nationality: string;
  notable_works: string[];
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Movies
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

  // Genres
  getGenres(): Observable<Genre[]> {
    return this.http.get<Genre[]>(`${this.baseUrl}/genres`);
  }

  // Actors
  getActors(): Observable<Actor[]> {
    return this.http.get<Actor[]>(`${this.baseUrl}/actors`);
  }

  getActor(id: number): Observable<Actor> {
    return this.http.get<Actor>(`${this.baseUrl}/actors/${id}`);
  }

  getActorByName(name: string): Observable<Actor[]> {
    const params = new HttpParams().set('name', name);
    return this.http.get<Actor[]>(`${this.baseUrl}/actors`, { params });
  }
}
