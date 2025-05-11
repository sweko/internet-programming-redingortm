import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { ActorService } from '../../services/actor.service';
import { Movie } from '../../models/movie.model';
import { Cast } from '../../models/movie.model';
import { Actor } from '../../models/actor.model';

@Component({
  selector: 'app-cast-add',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cast-add.component.html',
  styleUrl: './cast-add.component.css'
})
export class CastAddComponent implements OnInit {
  movie: Movie | null = null;
  actors: Actor[] = [];
  newCastMember: Cast = {
    actor: '',
    character: ''
  };
  actorSuggestions: Actor[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService,
    private actorService: ActorService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadMovie(id);
    this.loadActors();
  }

  loadMovie(id: number): void {
    this.movieService.getMovie(id).subscribe({
      next: (movie) => {
        this.movie = movie;
      },
      error: (error) => {
        console.error('Error loading movie', error);
      }
    });
  }

  loadActors(): void {
    this.actorService.getActors().subscribe({
      next: (actors) => {
        this.actors = actors;
      },
      error: (error) => {
        console.error('Error loading actors', error);
      }
    });
  }

  onActorInput(): void {
    if (this.newCastMember.actor.length > 2) {
      this.actorSuggestions = this.actors.filter(actor => 
        actor.name.toLowerCase().includes(this.newCastMember.actor.toLowerCase())
      ).slice(0, 5);
    } else {
      this.actorSuggestions = [];
    }
  }

  selectActor(actor: Actor): void {
    this.newCastMember.actor = actor.name;
    this.actorSuggestions = [];
  }

  addCastMember(): void {
    if (!this.newCastMember.actor || !this.newCastMember.character) {
      alert('Please enter both actor name and character name');
      return;
    }

    if (!this.movie) {
      return;
    }

    if (!this.movie.cast) {
      this.movie.cast = [];
    }

    // Check if actor already exists in the cast
    const existingCast = this.movie.cast.find(c => c.actor === this.newCastMember.actor);
    if (existingCast) {
      alert(`${this.newCastMember.actor} is already in the cast as ${existingCast.character}`);
      return;
    }

    // Add new cast member
    this.movie.cast.push({
      actor: this.newCastMember.actor,
      character: this.newCastMember.character
    });

    // Update the movie
    this.movieService.updateMovie(this.movie).subscribe({
      next: (updatedMovie) => {
        this.router.navigate(['/movies', updatedMovie.id]);
      },
      error: (error) => {
        console.error('Error updating movie', error);
      }
    });
  }
}
