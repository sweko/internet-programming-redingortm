import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Actor } from '../models/actor.model';

@Injectable({
  providedIn: 'root'
})
export class ActorService {
  private apiUrl = 'http://localhost:3000/actors';

  constructor(private http: HttpClient) { }

  getActors(): Observable<Actor[]> {
    return this.http.get<Actor[]>(this.apiUrl);
  }

  getActor(id: number): Observable<Actor> {
    return this.http.get<Actor>(`${this.apiUrl}/${id}`);
  }

  getActorByName(name: string): Observable<Actor[]> {
    return this.http.get<Actor[]>(`${this.apiUrl}?name=${name}`);
  }
}
