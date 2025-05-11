# Movie Management System

A web application for managing movies, actors, and related data. Built with Angular and JSON Server.

## Features

- View, create, edit, and delete movies
- View actor details and their filmography
- Filter and sort movies by various criteria
- View statistics about the movie database
- Responsive design for all screen sizes

## Technologies Used

- Angular 19.1.5
- JSON Server for backend API
- Bootstrap 5 for styling
- TypeScript
- HTML/CSS

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Running the Application

To start both the frontend and backend servers concurrently:

```bash
npm start
```

This will start:
- Angular frontend at http://localhost:4200
- JSON Server backend at http://localhost:3000

### Running Separately

To run the frontend only:

```bash
npm run start:front
```

To run the backend only:

```bash
npm run start:back
```

## Project Structure

- `src/app/components/` - Angular components
- `src/app/services/` - Services for API communication
- `src/app/models/` - TypeScript interfaces
- `db/` - JSON data for the backend

## API Endpoints

- `GET /movies` - Returns a list of movies
- `GET /movies/:id` - Returns a single movie by id
- `POST /movies` - Creates a new movie
- `PUT /movies/:id` - Updates an existing movie
- `DELETE /movies/:id` - Deletes an existing movie
- `GET /genres` - Returns a list of genres
- `GET /actors` - Returns a list of actors
- `GET /actors/:id` - Returns a single actor by id
- `GET /actors?name=<actor-name>` - Returns a single actor by full name

## Author

- Student ID: 5570
- Student Name: Usein Edis
