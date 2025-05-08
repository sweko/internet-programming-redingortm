import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../movie.service';
import { Movie } from '../movie';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movie-edit',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './movie-edit.component.html',
  styleUrl: './movie-edit.component.css'
})
export class MovieEditComponent implements OnInit {
  movie: Movie | undefined;
  genres: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.movieService.getMovie(id).subscribe(movie => {
      this.movie = movie;
    });
    this.movieService.getGenres().subscribe(genres => {
      this.genres = genres;
    });
  }

  saveMovie(): void {
    if (this.movie) {
      this.movieService.updateMovie(this.movie.id, this.movie)
        .subscribe(() => this.router.navigate(['/movies', this.movie?.id]));
    }
  }
}
