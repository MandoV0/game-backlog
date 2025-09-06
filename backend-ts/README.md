# GameBacklog API

A comprehensive REST API for managing your gaming backlog, built with TypeScript, Express.js, and PostgreSQL.

## Features

- 🎮 **Game Management**: Search, filter, and browse games with detailed information
- 👤 **User Authentication**: Secure registration and login with JWT tokens
- 📚 **Backlog Management**: Add, update, and organize your game collection
- ⭐ **Review System**: Rate and review games you've played
- ⏱️ **Playtime Tracking**: Log and track your gaming sessions
- 📊 **Statistics**: View your gaming statistics and activity

## Tech Stack

- **Backend**: TypeScript, Express.js, Node.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Environment**: dotenv

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Database**
   - Create a PostgreSQL database
   - Run the SQL schema from `src/schema.sql`

3. **Environment Configuration**
   Create a `.env` file:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=gamebacklog
   DB_USER=your_username
   DB_PASSWORD=your_password
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=3000
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **API Documentation**
   See `API_DOCUMENTATION.md` for complete endpoint documentation.

## API Endpoints Overview

### Games
- `GET /api/v1/games` - Get all games
- `GET /api/v1/games/search` - Search games with filters
- `GET /api/v1/games/:id` - Get game by ID
- `GET /api/v1/games/platforms` - Get all platforms
- `GET /api/v1/games/genres` - Get all genres

### Users
- `POST /api/v1/users/register` - Register new user
- `POST /api/v1/users/login` - Login user
- `GET /api/v1/users/profile` - Get user profile

### Backlog Management
- `GET /api/v1/users/backlog` - Get user's backlog
- `POST /api/v1/users/backlog` - Add game to backlog
- `PUT /api/v1/users/backlog/:gameId` - Update game status
- `DELETE /api/v1/users/backlog/:gameId` - Remove from backlog

### Reviews
- `GET /api/v1/users/reviews` - Get user's reviews
- `POST /api/v1/users/reviews` - Create review
- `PUT /api/v1/users/reviews/:gameId` - Update review
- `DELETE /api/v1/users/reviews/:gameId` - Delete review

### Playtime Tracking
- `POST /api/v1/users/playtime` - Log playtime
- `GET /api/v1/users/playtime/stats` - Get playtime statistics

## Project Structure

```
src/
├── config/          # Database configuration
├── controllers/     # Request handlers
├── middlewares/     # Custom middleware
├── models/          # TypeScript interfaces
├── repositories/    # Database access layer
├── routes/          # API routes
├── services/        # Business logic
├── types/           # Type definitions
├── utils/           # Utility functions
├── app.ts           # Express app setup
└── server.ts        # Server entry point
```

## Development

- **Build**: `npm run build`
- **Start**: `npm start`
- **Test**: `npm test`
- **Dev**: `npm run dev`

## Database Schema

The API uses a PostgreSQL database with the following main tables:
- `games` - Game information
- `users` - User accounts
- `user_games` - User's game backlog and status
- `reviews` - User reviews
- `platforms` - Gaming platforms
- `genres` - Game genres
- `game_images` - Game images and screenshots

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

All errors follow a consistent format:
```json
{
  "status": "error",
  "message": "Error description"
}
```

## License

This project is for portfolio purposes.
