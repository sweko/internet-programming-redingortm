import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { ActorService } from '../../services/actor.service';
import { Movie } from '../../models/movie.model';
import { Actor } from '../../models/actor.model';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.css'
})
export class MovieDetailsComponent implements OnInit {
  movie: Movie | null = null;
  similarMoviesByGenre: Movie[] = [];
  similarMoviesByDirector: Movie[] = [];
  similarMoviesByActor: Movie[] = [];
  actors: Map<string, Actor> = new Map();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService,
    private actorService: ActorService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadMovie(id);
  }

  loadMovie(id: number): void {
    this.movieService.getMovie(id).subscribe({
      next: (movie) => {
        this.movie = movie;
        this.loadActors();
        this.loadSimilarMovies();
      },
      error: (error) => {
        console.error('Error loading movie', error);
      }
    });
  }

  loadActors(): void {
    if (this.movie && this.movie.cast) {
      this.movie.cast.forEach(castMember => {
        this.actorService.getActorByName(castMember.actor).subscribe({
          next: (actors) => {
            if (actors.length > 0) {
              this.actors.set(castMember.actor, actors[0]);
            }
          },
          error: (error) => {
            console.error(`Error loading actor ${castMember.actor}`, error);
          }
        });
      });
    }
  }

  loadSimilarMovies(): void {
    if (this.movie) {
      // Load all movies for comparison
      this.movieService.getMovies().subscribe({
        next: (movies) => {
          // Filter out the current movie
          const otherMovies = movies.filter(m => m.id !== this.movie?.id);

          // Similar movies by genre
          this.similarMoviesByGenre = otherMovies
            .filter(m => this.hasCommonGenre(m.genre, this.movie?.genre || []))
            .sort((a, b) => a.title.localeCompare(b.title))
            .slice(0, 5);

          // Similar movies by director
          this.similarMoviesByDirector = otherMovies
            .filter(m => m.director === this.movie?.director)
            .sort((a, b) => a.title.localeCompare(b.title))
            .slice(0, 5);

          // Similar movies by actor
          if (this.movie?.cast) {
            const actorNames = this.movie.cast.map(c => c.actor);
            this.similarMoviesByActor = otherMovies
              .filter(m => m.cast && m.cast.some(c => actorNames.includes(c.actor)))
              .sort((a, b) => a.title.localeCompare(b.title))
              .slice(0, 5);
          }
        },
        error: (error) => {
          console.error('Error loading similar movies', error);
        }
      });
    }
  }

  hasCommonGenre(genres1: string[], genres2: string[]): boolean {
    return genres1.some(g => genres2.includes(g));
  }

  deleteMovie(): void {
    if (this.movie && confirm('Are you sure you want to delete this movie?')) {
      this.movieService.deleteMovie(this.movie.id).subscribe({
        next: () => {
          this.router.navigate(['/movies']);
        },
        error: (error) => {
          console.error('Error deleting movie', error);
        }
      });
    }
  }

  formatOscarName(oscarType: string): string {
    // Convert camelCase to Title Case with spaces
    return oscarType
      .replace(/([A-Z])/g, ' $1') // Insert a space before all uppercase letters
      .replace(/^./, (str) => str.toUpperCase()); // Uppercase the first letter
  }

  hasOscars(oscars: { [key: string]: string }): boolean {
    return Object.keys(oscars).length > 0;
  }
}
