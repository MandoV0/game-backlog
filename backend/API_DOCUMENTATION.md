# GameBacklog API Documentation

## Base URL
Use a relative base path so the same docs work locally and in production:
```
/api/v1
```

## Authentication
Most user routes require a JWT in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## Games Endpoints

### Get All Games
```http
GET /games?limit=10&offset=0
```

- **limit** (optional): number per page (default 10)
- **offset** (optional): number to skip (default 0)

Response:
```json
{
  "count": 4,
  "results": [
    {
      "id": 1,
      "title": "Example",
      "release_year": 2022,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get Game by ID
```http
GET /games/:id
```

Returns a game with related data (e.g., platforms, genres, images) if available.

### Get Genres
```http
GET /games/genres
```

Response:
```json
[
  { "id": 1, "name": "RPG" }
]
```

### Get Platforms
```http
GET /games/platforms
```

Response:
```json
[
  { "id": 1, "name": "PC" }
]
```

### Get Reviews for a Game
```http
GET /games/:id/reviews?limit=10&offset=0
```

Response:
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "game_id": 1,
      "user_id": 10,
      "rating": 9,
      "title": "Great",
      "content": "...",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get Rating Statistics for a Game
```http
GET /games/:id/review-statistics
```

Response:
```json
{
  "status": "success",
  "data": {
    "total_reviews": 3,
    "average_rating": 8.7,
    "ten_star_reviews": 1,
    "nine_star_reviews": 1,
    "eight_star_reviews": 1,
    "seven_star_reviews": 0,
    "six_star_reviews": 0,
    "five_star_reviews": 0,
    "four_star_reviews": 0,
    "three_star_reviews": 0,
    "two_star_reviews": 0,
    "one_star_reviews": 0,
    "zero_star_reviews": 0
  }
}
```

### Get Backlog Status Statistics for a Game
```http
GET /games/:id/status-statistics
```

Response:
```json
{
  "status": "success",
  "data": {
    "playing": 2,
    "completed": 5,
    "backlog": 3,
    "dropped": 1
  }
}
```

---

## User Endpoints

### Register
```http
POST /users/register
```

Request body:
```json
{
  "username": "gamer123",
  "email": "gamer@example.com",
  "password": "securepassword"
}
```

Response:
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": 1,
      "username": "gamer123",
      "email": "gamer@example.com",
      "created_at": "2024-01-01T00:00:00.000Z"
    },
    "token": "<jwt>"
  }
}
```

### Login
```http
POST /users/login
```

Request body:
```json
{
  "email": "gamer@example.com",
  "password": "securepassword"
}
```

Response:
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": 1,
      "username": "gamer123",
      "email": "gamer@example.com",
      "created_at": "2024-01-01T00:00:00.000Z"
    },
    "token": "<jwt>"
  }
}
```

---

## Backlog (authenticated)

Authorization header is required for all endpoints below.

### Get User Backlog
```http
GET /users/backlog
```

Response:
```json
{
  "status": "success",
  "data": [
    {
      "game_id": 1,
      "user_id": 1,
      "status": "playing",
      "rating": 9,
      "started_at": "2024-01-01",
      "finished_at": null,
      "title": "Elden Ring"
    }
  ]
}
```

### Add Game to Backlog
```http
POST /users/backlog
```

Request body:
```json
{
  "gameId": 1
}
```

Response (201):
```json
{
  "status": "success",
  "data": {
    "game_id": 1,
    "user_id": 1,
    "status": "backlog"
  }
}
```

### Update Game Backlog Status
```http
PUT /users/backlog
```

Request body:
```json
{
  "gameId": 1,
  "status": "completed"
}
```

Response:
```json
{
  "status": "success",
  "data": {
    "game_id": 1,
    "user_id": 1,
    "status": "completed"
  }
}
```

### Remove Game from Backlog
```http
DELETE /users/backlog
```

Request body:
```json
{
  "gameId": 1
}
```

Response:
```json
{ "status": "success" }
```

---

## Reviews (authenticated)

### Get User Reviews
```http
GET /users/reviews
```

Response:
```json
{
  "status": "success",
  "data": [
    {
      "game_id": 1,
      "user_id": 1,
      "title": "Great",
      "content": "...",
      "rating": 9,
      "game_title": "Example"
    }
  ]
}
```

### Create Review
```http
POST /users/reviews
```

Request body:
```json
{
  "gameId": 1,
  "rating": 9,
  "reviewText": "...",
  "title": "Great"
}
```

Response (201):
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "game_id": 1,
    "user_id": 1,
    "rating": 9,
    "title": "Great",
    "content": "..."
  }
}
```

### Delete Review
```http
DELETE /users/reviews
```

Request body:
```json
{
  "gameId": 1
}
```

Response:
```json
{ "status": "success" }
```

---

## Error Responses

All error responses follow this format:
```json
{
  "status": "error",
  "message": "Error description"
}
```

Common HTTP Status Codes:
- 400 - Bad Request (invalid input)
- 401 - Unauthorized (missing or invalid token)
- 404 - Not Found (resource doesn't exist)
- 409 - Conflict (resource already exists)
- 500 - Internal Server Error
