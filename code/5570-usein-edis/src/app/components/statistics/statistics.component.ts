import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../services/movie.service';
import { ActorService } from '../../services/actor.service';
import { GenreService } from '../../services/genre.service';
import { Movie } from '../../models/movie.model';
import { Actor } from '../../models/actor.model';
import { Genre } from '../../models/genre.model';

interface OscarCount {
  type: string;
  count: number;
}

interface GenreCount {
  genre: string;
  count: number;
}

interface DecadeCount {
  decade: string;
  count: number;
}

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule], // Router Link
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css'
})
export class StatisticsComponent implements OnInit {
  movies: Movie[] = [];
  actors: Actor[] = [];
  genres: Genre[] = [];

  totalMovies: number = 0;
  totalActors: number = 0;
  totalGenres: number = 0;
  totalOscars: number = 0;

  oscarsByType: OscarCount[] = [];
  oscarsByGenre: GenreCount[] = [];
  moviesByDecade: DecadeCount[] = [];
  moviesByGenre: GenreCount[] = [];

  actorsWithoutDetails: Actor[] = [];
  moviesWithoutDetails: Movie[] = [];

  constructor(
    private movieService: MovieService,
    private actorService: ActorService,
    private genreService: GenreService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.movieService.getMovies().subscribe({
      next: (movies) => {
        this.movies = movies;
        this.totalMovies = movies.length;
        this.calculateStatistics();
      },
      error: (error) => {
        console.error('Error loading movies', error);
      }
    });

    this.actorService.getActors().subscribe({
      next: (actors) => {
        this.actors = actors;
        this.totalActors = actors.length;
        this.findActorsWithoutDetails();
      },
      error: (error) => {
        console.error('Error loading actors', error);
      }
    });

    this.genreService.getGenres().subscribe({
      next: (genres) => {
        this.genres = genres;
        this.totalGenres = genres.length;
      },
      error: (error) => {
        console.error('Error loading genres', error);
      }
    });
  }

  calculateStatistics(): void {
    this.calculateTotalOscars();
    this.calculateOscarsByType();
    this.calculateOscarsByGenre();
    this.calculateMoviesByDecade();
    this.calculateMoviesByGenre();
    this.findMoviesWithoutDetails();
  }

  calculateTotalOscars(): void {
    this.totalOscars = this.movies.reduce((total, movie) => {
      return total + (movie.oscars ? Object.keys(movie.oscars).length : 0);
    }, 0);
  }

  calculateOscarsByType(): void {
    const oscarTypes: { [key: string]: number } = {};

    this.movies.forEach(movie => {
      if (movie.oscars) {
        Object.keys(movie.oscars).forEach(oscarType => {
          oscarTypes[oscarType] = (oscarTypes[oscarType] || 0) + 1;
        });
      }
    });

    this.oscarsByType = Object.entries(oscarTypes).map(([type, count]) => ({
      type: this.formatOscarName(type),
      count
    })).sort((a, b) => b.count - a.count);
  }

  calculateOscarsByGenre(): void {
    const genreOscars: { [key: string]: number } = {};

    this.movies.forEach(movie => {
      if (movie.oscars) {
        const oscarCount = Object.keys(movie.oscars).length;
        if (oscarCount > 0) {
          movie.genre.forEach(genre => {
            genreOscars[genre] = (genreOscars[genre] || 0) + oscarCount;
          });
        }
      }
    });

    this.oscarsByGenre = Object.entries(genreOscars).map(([genre, count]) => ({
      genre,
      count
    })).sort((a, b) => b.count - a.count);
  }

  calculateMoviesByDecade(): void {
    const decades: { [key: string]: number } = {};

    this.movies.forEach(movie => {
      const decade = Math.floor(movie.year / 10) * 10;
      const decadeStr = `${decade}s`;
      decades[decadeStr] = (decades[decadeStr] || 0) + 1;
    });

    this.moviesByDecade = Object.entries(decades).map(([decade, count]) => ({
      decade,
      count
    })).sort((a, b) => {
      // Extract the decade number for sorting
      const decadeA = parseInt(a.decade);
      const decadeB = parseInt(b.decade);
      return decadeA - decadeB;
    });
  }

  calculateMoviesByGenre(): void {
    const genreCounts: { [key: string]: number } = {};

    this.movies.forEach(movie => {
      movie.genre.forEach(genre => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });
    });

    this.moviesByGenre = Object.entries(genreCounts).map(([genre, count]) => ({
      genre,
      count
    })).sort((a, b) => b.count - a.count);
  }

  findActorsWithoutDetails(): void {
    const actorNames = new Set(this.actors.map(actor => actor.name));
    const movieActors = new Set<string>();

    this.movies.forEach(movie => {
      if (movie.cast) {
        movie.cast.forEach(castMember => {
          movieActors.add(castMember.actor);
        });
      }
    });

    // Find actors in movies that don't have details
    this.actorsWithoutDetails = Array.from(movieActors)
      .filter(name => !actorNames.has(name))
      .map(name => ({ id: 0, name }));
  }

  findMoviesWithoutDetails(): void {
    const movieTitles = new Set(this.movies.map(movie => movie.title));
    const actorMovies = new Set<string>();

    this.actors.forEach(actor => {
      if (actor.notable_works) {
        actor.notable_works.forEach(work => {
          actorMovies.add(work);
        });
      }
    });

    // Find movies mentioned in actor notable works that don't have details
    this.moviesWithoutDetails = Array.from(actorMovies)
      .filter(title => !movieTitles.has(title))
      .map(title => ({ id: 0, title, year: 0, director: '', genre: [] }));
  }

  formatOscarName(oscarType: string): string {
    // Convert camelCase to Title Case with spaces
    return oscarType
      .replace(/([A-Z])/g, ' $1') // Insert a space before all uppercase letters
      .replace(/^./, (str) => str.toUpperCase()); // Uppercase the first letter
  }
}
