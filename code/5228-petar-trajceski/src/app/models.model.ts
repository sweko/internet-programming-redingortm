export interface CastMember {
    actor: string;
    character: string;
  }
  
  export interface Movie {
    id: number;
    title: string;
    year: number;
    director: string;
    genre: string[];
    plot?: string;
    rating?: number;
    cast?: CastMember[];
    oscars?: { [key: string]: string };
  }
  
  export interface Genre {
    id: string;
    name: string;
  }
  
  export interface Actor {
    id: number;
    name: string;
    birthdate?: string;
    height?: number;
    nationality?: string;
    notable_works?: string[];
  }
  