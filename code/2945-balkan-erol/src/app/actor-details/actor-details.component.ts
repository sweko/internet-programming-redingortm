import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService, Actor, Movie } from '../api.service';

@Component({
  selector: 'app-actor-details',
  templateUrl: './actor-details.component.html',
  styleUrls: ['./actor-details.component.css']
})
export class ActorDetailsComponent implements OnInit {
  actor: Actor | null = null;
  notableMovies: Movie[] = [];

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadActor(id);
  }

  loadActor(id: number): void {
    this.apiService.getActor(id).subscribe(actor => {
      this.actor = actor;
      this.loadNotableMovies(actor.notable_works);
    });
  }

  loadNotableMovies(titles: string[]): void {
    this.apiService.getMovies().subscribe(movies => {
      this.notableMovies = movies.filter(m => titles.includes(m.title))
        .sort((a, b) => a.title.localeCompare(b.title));
    });
  }
}
