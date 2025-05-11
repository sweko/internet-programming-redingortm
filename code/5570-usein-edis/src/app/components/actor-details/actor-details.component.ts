import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ActorService } from '../../services/actor.service';
import { MovieService } from '../../services/movie.service';
import { Actor } from '../../models/actor.model';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-actor-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './actor-details.component.html',
  styleUrl: './actor-details.component.css'
})
export class ActorDetailsComponent implements OnInit {
  actor: Actor | null = null;
  movies: Movie[] = [];
  notableMovies: Movie[] = [];

  constructor(
    private route: ActivatedRoute,
    private actorService: ActorService,
    private movieService: MovieService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadActor(id);
  }

  loadActor(id: number): void {
    this.actorService.getActor(id).subscribe({
      next: (actor) => {
        this.actor = actor;
        this.loadMovies();
      },
      error: (error) => {
        console.error('Error loading actor', error);
      }
    });
  }

  loadMovies(): void {
    if (this.actor) {
      this.movieService.getMovies().subscribe({
        next: (movies) => {
          // Find movies where this actor appears in the cast
          this.movies = movies.filter(movie =>
            movie.cast && movie.cast.some(castMember =>
              castMember.actor === this.actor?.name
            )
          );

          // Find notable movies that exist in our database
          if (this.actor && this.actor.notable_works) {
            this.notableMovies = movies.filter(movie =>
              this.actor?.notable_works?.includes(movie.title)
            );
          }
        },
        error: (error) => {
          console.error('Error loading movies', error);
        }
      });
    }
  }

  // Helper method to check if a notable work exists in our movie database
  hasNotableMovie(workTitle: string): boolean {
    return this.notableMovies.some(movie => movie.title === workTitle);
  }

  // Helper method to get the ID of a notable movie
  getNotableMovieId(workTitle: string): number {
    const movie = this.notableMovies.find(movie => movie.title === workTitle);
    return movie ? movie.id : 0;
  }

  // Helper method to get the character name for an actor in a movie
  getCharacterName(movie: Movie, actorName: string): string {
    if (!movie.cast || !actorName) return '';

    const castMember = movie.cast.find(c => c.actor === actorName);
    return castMember ? castMember.character : '';
  }
}
