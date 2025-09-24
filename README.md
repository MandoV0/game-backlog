# Game Backlog
This project is a web application for browsing games and managing a game backlog.

## Purpose
This project is just a personal project to get into web development.

## State
The project isnt perfect, a lot of features are missing, the UI isnt super good looking, and the code isnt 100% clean everywhere.
But at some point, I just wanted to get it done. I consider it “done enough” for the goal i set and plan to move on to my next project.

Think of this as a learning project and not a production grade Website.


# Run locally

## Backend
Create a .env file in the Backend
```
NODE_ENV=development                                                            # development/production
DATABASE_URL=postgresql://postgres:gamebacklog@localhost:5432/game_backlog_v1   # URL to Database
```

Import backup.sql dump into your Database.

## Frontend
Create a .env file in the frontend
```
VITE_APP_API_BASE_URL=http://localhost:3000/api/v1                              # URL to Backend
```

run both using 
```
npm run dev
```

## Docker
You can also start the whole project (backend + frontend + database) using Docker Compose.
It also automatically imports the backup.sql into your database.
```
docker-compose up
```