import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, Movie, Genre } from '../api.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-movie-create',
  templateUrl: './movie-create.component.html',
  styleUrls: ['./movie-create.component.css']
})
export class MovieCreateComponent implements OnInit {
  movieForm!: FormGroup;
  genres: Genre[] = [];

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadGenres();
    this.initForm();
  }

  loadGenres(): void {
    this.apiService.getGenres().subscribe(genres => {
      this.genres = genres;
    });
  }

  initForm(): void {
    this.movieForm = this.fb.group({
      title: ['', Validators.required],
      year: ['', [Validators.required, Validators.min(1800), Validators.max(new Date().getFullYear())]],
      plot: [''],
      director: ['', Validators.required],
      genre: this.fb.array(this.genres.map(() => false)),
      rating: [''],
      oscars: this.fb.array([])
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
    const formValue = this.movieForm.value;
    const selectedGenres = this.genres
      .filter((_, i) => formValue.genre[i])
      .map(g => g.id);
    const oscarsObj: { [key: string]: string } = {};
    formValue.oscars.forEach((o: any) => {
      oscarsObj[o.type] = o.recipient;
    });

    const newMovie: Movie = {
      id: 0, // id will be assigned by backend
      title: formValue.title,
      year: formValue.year,
      plot: formValue.plot,
      director: formValue.director,
      genre: selectedGenres,
      rating: formValue.rating,
      oscars: oscarsObj,
      cast: []
    };

    this.apiService.createMovie(newMovie).subscribe(movie => {
      this.router.navigate(['/movies', movie.id]);
    });
  }
}
