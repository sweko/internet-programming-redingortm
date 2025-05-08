import fs from 'fs';
import chalk from 'chalk';

const red = (message: string) => console.log(chalk.red(message));
const green = (message: string) => console.log(chalk.green(message));
const yellow = (message: string) => console.log(chalk.yellow(message));

const validate = (condition: boolean, good: string, bad: string) => {
    if (condition) {
        green(good);
    } else {
        red(bad);
    }
}

interface MovieData {
    id: number,
    title: string,
    year: number, // the year the movie was released
    director: string, // the name of the director
    genre: string[], // an array of strings, each string is the a distinct genre
    plot: string, // a short description of the plot
    cast:
    {
        actor: string, // the name of the actor
        character: string // the name of the character played by the actor
    }[], // an array of cast objects,
    oscars: Record<string, string>, // an object with key-value pairs where the key is the type of oscar won and the value is the recipient{
    rating: number
}

interface GenreData {
    id: number, // required, unique
    name: string, // required
}

interface ActorData {
    id: number,
    name: string,
    birthdate: string, // a string in the format "Month DD, YYYY"
    height: number, // a value in centimeters
    nationality: string, // a string
    notable_works: string[] // an array of strings, each string is the title of a movie
  }
interface DB {
    movies: MovieData[],
    genres: GenreData[],
    actors: ActorData[]
}

const fileLocation = './code/template/db/movie-data.json';

const data: DB = JSON.parse(fs.readFileSync(fileLocation, 'utf8'));
yellow(`Data successfully loaded from ${fileLocation}`);
yellow(`Detected ${data.movies.length} movies`);
yellow(`Detected ${data.genres.length} genres`);
yellow(`Detected ${data.actors.length} actors`);

yellow("--- Checking genres ---");
//unique id for each genre
const genreIds = new Set<number>(data.genres.filter(genre => genre.id).map(genre => genre.id));
validate(genreIds.size === data.genres.length, "genre ids are present and unique", "genre ids are not unique or are missing");

// every genre has a name
validate(data.genres.every(genre => genre.name), "All genres have a name", "Some genres are missing a name");

yellow("--- Checking actors ---");

//unique id for each actor
const actorIds = new Set<number>(data.actors.filter(actor => actor.id).map(actor => actor.id));
validate(actorIds.size === data.actors.length, "actor ids are present and unique", "actor ids are not unique or are missing");

// every actor has a name
validate(data.actors.every(actor => actor.name), "All actors have a name", "Some actors are missing a name");

yellow("--- Checking movies ---");

//unique id for each movie
const movieIds = new Set<number>(data.movies.filter(movie => movie.id).map(movie => movie.id));
validate(movieIds.size === data.movies.length, "movie ids are present and unique", "movie ids are not unique or are missing");

// every movie has an id
validate(data.movies.every(movie => movie.id), "All movies have an id", "Some movies are missing an id");

// every movie has a title
validate(data.movies.every(movie => movie.title), "All movies have a title", "Some movies are missing a title");

// genre is a list of valid genres from the genres endpoint
validate(data.movies.every(movie => movie.genre.every(genre => data.genres.find(g => g.name === genre))), "All movies have a valid genre field", "Some movies have invalid genre field");

// cast has actor and character fields
validate(data.movies.every(movie => movie.cast.every(cast => cast.actor && cast.character)), "All movies have a valid cast field", "Some movies have invalid cast field");

// cast is an array
validate(data.movies.every(movie => Array.isArray(movie.cast)), "All movies have a valid cast field", "Some movies have invalid cast field");

// oscars is an object
validate(data.movies.every(movie => typeof movie.oscars === 'object'), "All movies have a valid oscars field", "Some movies have invalid oscars field");

// rating is a number between 0 and 10
validate(data.movies.every(movie => movie.rating >= 0 && movie.rating <= 10), "All movies have a valid rating field", "Some movies have invalid rating field");

// year is a number
validate(data.movies.every(movie => typeof movie.year === 'number'), "All movies have a valid year field", "Some movies have invalid year field");

// director is a string
validate(data.movies.every(movie => typeof movie.director === 'string'), "All movies have a valid director field", "Some movies have invalid director field");

// plot is a string
validate(data.movies.every(movie => typeof movie.plot === 'string'), "All movies have a valid plot field", "Some movies have invalid plot field");

