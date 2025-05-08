export interface Movie {
  id: number;
  title: string;
  year: number;
  plot: string;
  director: string;
  genre: string[];
  rating: number;
  cast: { actor: string; role: string }[];
}
