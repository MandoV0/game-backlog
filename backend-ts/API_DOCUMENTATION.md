# GameBacklog API Documentation

## Base URL
```
http://localhost:3000/api/v1
```

## Authentication
Most endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 🎮 Games Endpoints

### Get All Games
```http
GET /games?limit=10&offset=0
```

**Query Parameters:**
- `limit` (optional): Number of games per page (default: 10)
- `offset` (optional): Number of games to skip (default: 0)

**Response:**
```json
{
  "count": 4,
  "results": [
    {
      "id": 1,
      "title": "Elden Ring",
      "release_year": 2022,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z",
      "platforms": [{"id": 1, "name": "PC"}, {"id": 2, "name": "PS5"}],
      "genres": [{"id": 1, "name": "RPG"}, {"id": 2, "name": "Action"}],
      "images": [{"id": 1, "url": "https://example.com/eldenring_cover.jpg", "type": "cover"}]
    }
  ]
}
```

### Search Games
```http
GET /games/search?q=zelda&genres=1,2&platforms=1,2&yearFrom=2020&yearTo=2023&sortBy=title&sortOrder=asc&limit=10&offset=0
```

**Query Parameters:**
- `q` (optional): Search query for game title
- `genres` (optional): Comma-separated genre IDs
- `platforms` (optional): Comma-separated platform IDs
- `yearFrom` (optional): Minimum release year
- `yearTo` (optional): Maximum release year
- `sortBy` (optional): Sort field (title, release_year, created_at)
- `sortOrder` (optional): Sort order (asc, desc)
- `limit` (optional): Number of games per page
- `offset` (optional): Number of games to skip

### Get Game by ID
```http
GET /games/:id
```

### Get Platforms
```http
GET /games/platforms
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {"id": 1, "name": "PC"},
    {"id": 2, "name": "PS5"},
    {"id": 3, "name": "Xbox Series X"},
    {"id": 4, "name": "Switch"}
  ]
}
```

### Get Genres
```http
GET /games/genres
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {"id": 1, "name": "RPG"},
    {"id": 2, "name": "Action"},
    {"id": 3, "name": "Adventure"},
    {"id": 4, "name": "Strategy"}
  ]
}
```

---

## 👤 User Endpoints

### Register User
```http
POST /users/register
```

**Request Body:**
```json
{
  "username": "gamer123",
  "email": "gamer@example.com",
  "password": "securepassword"
}
```

**Response:**
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
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login User
```http
POST /users/login
```

**Request Body:**
```json
{
  "email": "gamer@example.com",
  "password": "securepassword"
}
```

**Response:**
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
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Get User Profile
```http
GET /users/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "username": "gamer123",
    "email": "gamer@example.com",
    "password_hash": "hashed_password",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z",
    "total_games": 5,
    "completed_games": 2,
    "playing_games": 1,
    "backlog_games": 2,
    "dropped_games": 0,
    "total_rating": 17,
    "average_rating": 3.4
  }
}
```

---

## 📚 Backlog Management

### Get User Backlog
```http
GET /users/backlog?status=playing&limit=10&offset=0
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional): Filter by status (backlog, playing, completed, dropped)
- `limit` (optional): Number of games per page
- `offset` (optional): Number of games to skip

**Response:**
```json
{
  "status": "success",
  "data": {
    "count": 3,
    "results": [
      {
        "id": 1,
        "user_id": 1,
        "game_id": 1,
        "status": "playing",
        "rating": null,
        "started_at": "2024-01-01",
        "finished_at": null,
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z",
        "game": {
          "id": 1,
          "title": "Elden Ring",
          "release_year": 2022,
          "platforms": [{"id": 1, "name": "PC"}],
          "genres": [{"id": 1, "name": "RPG"}],
          "images": []
        }
      }
    ]
  }
}
```

### Add Game to Backlog
```http
POST /users/backlog
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "gameId": 1,
  "status": "backlog"
}
```

### Update Game Status
```http
PUT /users/backlog/:gameId
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "completed",
  "rating": 9,
  "startedAt": "2024-01-01",
  "finishedAt": "2024-01-15"
}
```

### Remove Game from Backlog
```http
DELETE /users/backlog/:gameId
Authorization: Bearer <token>
```

---

## ⭐ Reviews

### Get User Reviews
```http
GET /users/reviews?limit=10&offset=0
Authorization: Bearer <token>
```

### Create Review
```http
POST /users/reviews
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "gameId": 1,
  "title": "Amazing Game!",
  "content": "This game exceeded all my expectations...",
  "rating": 9
}
```

### Update Review
```http
PUT /users/reviews/:gameId
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Updated Review Title",
  "content": "Updated review content...",
  "rating": 10
}
```

### Delete Review
```http
DELETE /users/reviews/:gameId
Authorization: Bearer <token>
```

---

## ⏱️ Playtime Tracking

### Log Playtime
```http
POST /users/playtime
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "gameId": 1,
  "playtimeMinutes": 120,
  "notes": "Great session, made good progress!"
}
```

### Get Playtime Statistics
```http
GET /users/playtime/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "totalPlaytime": 1440,
    "gamesPlayed": 3,
    "averagePlaytime": 480,
    "recentActivity": [
      {
        "gameId": 1,
        "gameTitle": "Elden Ring",
        "lastPlayed": "2024-01-15T10:30:00.000Z",
        "totalPlaytime": 720
      }
    ]
  }
}
```

---

## 🚨 Error Responses

All error responses follow this format:
```json
{
  "status": "error",
  "message": "Error description"
}
```

**Common HTTP Status Codes:**
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (missing or invalid token)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (resource already exists)
- `500` - Internal Server Error

---

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gamebacklog
DB_USER=your_username
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Server Configuration
PORT=3000
NODE_ENV=development
```

---

## 🚀 Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up your database using the provided `schema.sql`

3. Create a `.env` file with your configuration

4. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`
