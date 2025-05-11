import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, Movie, Actor } from '../api.service';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit {
  movie: Movie | null = null;
  similarMoviesByGenre: Movie[] = [];
  similarMoviesByDirector: Movie[] = [];
  similarMoviesByActor: Movie[] = [];
  actorsMap: Map<string, Actor> = new Map();

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadMovie(id);
  }

  loadMovie(id: number): void {
    this.apiService.getMovie(id).subscribe(movie => {
      this.movie = movie;
      this.loadSimilarMovies();
      this.loadActorsMap();
    });
  }

  loadSimilarMovies(): void {
    if (!this.movie) return;
    this.apiService.getMovies().subscribe(movies => {
      // Similar by genre
      this.similarMoviesByGenre = movies.filter(m =>
        m.id !== this.movie!.id &&
        m.genre.some(g => this.movie!.genre.includes(g))
      ).sort((a, b) => a.title.localeCompare(b.title));

      // Similar by director
      this.similarMoviesByDirector = movies.filter(m =>
        m.id !== this.movie!.id &&
        m.director === this.movie!.director
      ).sort((a, b) => a.title.localeCompare(b.title));

      // Similar by actor
      const movieActorNames = this.movie!.cast.map(c => c.actor);
      this.similarMoviesByActor = movies.filter(m =>
        m.id !== this.movie!.id &&
        m.cast.some(c => movieActorNames.includes(c.actor))
      ).sort((a, b) => a.title.localeCompare(b.title));
    });
  }

  loadActorsMap(): void {
    this.apiService.getActors().subscribe(actors => {
      this.actorsMap.clear();
      actors.forEach(actor => this.actorsMap.set(actor.name, actor));
    });
  }

  formatOscarName(oscarKey: string): string {
    // Convert camelCase to Title Case with spaces
    return oscarKey.replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  }

  deleteMovie(): void {
    if (!this.movie) return;
    if (confirm('Are you sure you want to delete this movie?')) {
      this.apiService.deleteMovie(this.movie.id).subscribe(() => {
        this.router.navigate(['/movies']);
      });
    }
  }
}
