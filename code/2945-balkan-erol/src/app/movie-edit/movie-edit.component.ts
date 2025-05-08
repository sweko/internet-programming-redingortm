import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, Movie, Genre } from '../api.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-movie-edit',
  templateUrl: './movie-edit.component.html',
  styleUrls: ['./movie-edit.component.css']
})
export class MovieEditComponent implements OnInit {
  movieForm!: FormGroup;
  genres: Genre[] = [];
  movieId!: number;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.movieId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadGenres();
    this.initForm();
    this.loadMovie();
  }

  loadGenres(): void {
    this.apiService.getGenres().subscribe(genres => {
      this.genres = genres;
    });
  }

  initForm(): void {
    this.movieForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      title: ['', Validators.required],
      year: ['', [Validators.required, Validators.min(1800), Validators.max(new Date().getFullYear())]],
      plot: [''],
      director: ['', Validators.required],
      genre: this.fb.array([]),
      rating: [''],
      oscars: this.fb.array([])
    });
  }

  loadMovie(): void {
    this.apiService.getMovie(this.movieId).subscribe(movie => {
      this.movieForm.patchValue({
        id: movie.id,
        title: movie.title,
        year: movie.year,
        plot: movie.plot,
        director: movie.director,
        rating: movie.rating
      });
      this.setGenres(movie.genre);
      this.setOscars(movie.oscars);
    });
  }

  setGenres(selectedGenres: string[]): void {
    const genreFormArray = this.movieForm.get('genre') as FormArray;
    this.genres.forEach(genre => {
      genreFormArray.push(this.fb.control(selectedGenres.includes(genre.id)));
    });
  }

  setOscars(oscars: { [key: string]: string }): void {
    const oscarsFormArray = this.movieForm.get('oscars') as FormArray;
    Object.entries(oscars).forEach(([key, value]) => {
      oscarsFormArray.push(this.fb.group({
        type: [key, Validators.required],
        recipient: [value, Validators.required]
      }));
    });
  }

  get genreControls() {
    return (this.movieForm.get('genre') as FormArray).controls;
  }

  get oscarsControls() {
    return (this.movieForm.get('oscars') as FormArray).controls;
  }

  addOscar(): void {
    const oscarsFormArray = this.movieForm.get('oscars') as FormArray;
    oscarsFormArray.push(this.fb.group({
      type: ['', Validators.required],
      recipient: ['', Validators.required]
    }));
  }

  removeOscar(index: number): void {
    const oscarsFormArray = this.movieForm.get('oscars') as FormArray;
    oscarsFormArray.removeAt(index);
  }

  onSubmit(): void {
    if (this.movieForm.invalid) {
      return;
    }
    const formValue = this.movieForm.getRawValue();
    const selectedGenres = this.genres
      .filter((_, i) => formValue.genre[i])
      .map(g => g.id);
    const oscarsObj: { [key: string]: string } = {};
    formValue.oscars.forEach((o: any) => {
      oscarsObj[o.type] = o.recipient;
    });

    const updatedMovie: Movie = {
      id: formValue.id,
      title: formValue.title,
      year: formValue.year,
      plot: formValue.plot,
      director: formValue.director,
      genre: selectedGenres,
      rating: formValue.rating,
      oscars: oscarsObj,
      cast: [] // cast editing not handled here
    };

    this.apiService.updateMovie(this.movieId, updatedMovie).subscribe(() => {
      this.router.navigate(['/movies', this.movieId]);
    });
  }
}
