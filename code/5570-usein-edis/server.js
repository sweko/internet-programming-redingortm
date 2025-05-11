// Import required modules
const jsonServer = require('json-server');
const fs = require('fs');
const path = require('path');

// Create a server instance
const server = jsonServer.create();

// Read the JSON file
const jsonFilePath = path.join(__dirname, 'db', 'movie-data.json');
const rawData = fs.readFileSync(jsonFilePath);
const data = JSON.parse(rawData);

// Create a temporary file with the correct structure for json-server
const tempDbPath = path.join(__dirname, 'db', 'temp-db.json');
fs.writeFileSync(tempDbPath, JSON.stringify(data));

// Set up the router with the temporary file
const router = jsonServer.router(tempDbPath);

// Set default middlewares (logger, static, cors and no-cache)
const middlewares = jsonServer.defaults();
server.use(middlewares);

// Add custom routes to redirect /movies to the correct endpoint
server.get('/movies', (req, res) => {
  const db = router.db.getState();
  res.jsonp(db.movies || []);
});

server.get('/movies/:id', (req, res) => {
  const db = router.db.getState();
  const movie = db.movies.find(m => m.id === req.params.id);
  if (movie) {
    res.jsonp(movie);
  } else {
    res.status(404).jsonp({ error: "Movie not found" });
  }
});

// Handle POST requests to auto-increment IDs
server.use(jsonServer.bodyParser);
server.post('/movies', (req, res) => {
  const db = router.db.getState();
  const movies = db.movies || [];

  // Find the maximum ID and increment it by 1
  let maxId = 0;
  movies.forEach(movie => {
    const movieId = parseInt(movie.id);
    if (!isNaN(movieId) && movieId > maxId) {
      maxId = movieId;
    }
  });

  // Set the new ID for the movie being created
  const newMovie = { ...req.body, id: String(maxId + 1) };
  console.log(`Creating new movie with ID: ${newMovie.id}`);

  // Add the new movie to the array
  movies.push(newMovie);

  // Update the database
  db.movies = movies;
  fs.writeFileSync(jsonFilePath, JSON.stringify(db, null, 2));

  // Return the new movie
  res.status(201).jsonp(newMovie);
});

// Handle PUT requests to update movies
server.put('/movies/:id', (req, res) => {
  const db = router.db.getState();
  const movies = db.movies || [];
  const id = req.params.id;
  const movieIndex = movies.findIndex(m => m.id === id);

  if (movieIndex !== -1) {
    // Update the movie
    const updatedMovie = { ...req.body, id };
    movies[movieIndex] = updatedMovie;

    // Update the database
    db.movies = movies;
    fs.writeFileSync(jsonFilePath, JSON.stringify(db, null, 2));

    // Return the updated movie
    res.jsonp(updatedMovie);
  } else {
    res.status(404).jsonp({ error: "Movie not found" });
  }
});

// Handle DELETE requests
server.delete('/movies/:id', (req, res) => {
  const db = router.db.getState();
  const movies = db.movies || [];
  const id = req.params.id;
  const movieIndex = movies.findIndex(m => m.id === id);

  if (movieIndex !== -1) {
    // Remove the movie
    movies.splice(movieIndex, 1);

    // Update the database
    db.movies = movies;
    fs.writeFileSync(jsonFilePath, JSON.stringify(db, null, 2));

    // Return success
    res.status(200).jsonp({});
  } else {
    res.status(404).jsonp({ error: "Movie not found" });
  }
});

// Use default router for other routes
server.use(router);

// Start server
const port = 3000;
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
  console.log(`Access movies at http://localhost:${port}/movies`);
  console.log(`Server will restart when db/movie-data.json changes`);
});
