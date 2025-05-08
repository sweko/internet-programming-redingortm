import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, Movie } from '../api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-cast-create',
  templateUrl: './cast-create.component.html',
  styleUrls: ['./cast-create.component.css']
})
export class CastCreateComponent implements OnInit {
  movieId!: number;
  movie: Movie | null = null;
  castForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.movieId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadMovie();
    this.initForm();
  }

  loadMovie(): void {
    this.apiService.getMovie(this.movieId).subscribe(movie => {
      this.movie = movie;
    });
  }

  initForm(): void {
    this.castForm = this.fb.group({
      actor: ['', Validators.required],
      character: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.castForm.invalid || !this.movie) {
      return;
    }
    const formValue = this.castForm.value;
    const newCast = {
      actor: formValue.actor,
      character: formValue.character
    };
    const updatedCast = [...this.movie.cast, newCast];
    const updatedMovie: Movie = { ...this.movie, cast: updatedCast };

    this.apiService.updateMovie(this.movieId, updatedMovie).subscribe(() => {
      this.router.navigate(['/movies', this.movieId]);
    });
  }
}
