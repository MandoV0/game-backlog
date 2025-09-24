# Game Backlog
This project is a web application for browsing games and managing a game backlog.

## Purpose
This project is just a personal project to get into web development.

To run locally
Create a .env file in the Backend
```
NODE_ENV=development                                                            # development/production
DATABASE_URL=postgresql://postgres:gamebacklog@localhost:5432/game_backlog_v1   # URL to Database
```

Import backup.sql dump into your Database.


Create a .env file in the frontend
```
VITE_APP_API_BASE_URL=http://localhost:3000/api/v1                              # URL to Backend
```

run both using 
```
npm run dev
```

or just use the docker-compose.