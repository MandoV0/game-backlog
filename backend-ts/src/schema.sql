-- TABLES
CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    release_year INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE platforms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE genres (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- RELATIONS
CREATE TABLE game_images (
    id SERIAL PRIMARY KEY,
    game_id INT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    url VARCHAR(255) NOT NULL,
    type VARCHAR(50) DEFAULT 'screenshot', -- 'cover', 'screenshot'
    description TEXT
);

CREATE TABLE game_platforms (
    game_id INT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    platform_id INT NOT NULL REFERENCES platforms(id) ON DELETE CASCADE,
    PRIMARY KEY (game_id, platform_id)
);

CREATE TABLE game_genres (
    game_id INT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    genre_id INT NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY(game_id, genre_id)
);

CREATE TYPE game_status AS ENUM ('backlog', 'playing', 'completed', 'dropped');

CREATE TABLE user_games(
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    game_id INT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    status game_status NOT NULL DEFAULT 'backlog',
    rating INT CHECK (rating between 1 AND 10),
    started_at DATE,
    finished_at DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, game_id)
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    game_id INT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    title VARCHAR(100),
    content TEXT,
    rating INT CHECK (rating BETWEEN 1 AND 10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, game_id)
);  



-- FAKE DATA (CHATGPT)
-- =========================
-- Platforms
-- =========================
INSERT INTO platforms (name) VALUES
('PC'),
('PS5'),
('Xbox Series X'),
('Switch');

-- =========================
-- Genres
-- =========================
INSERT INTO genres (name) VALUES
('RPG'),
('Action'),
('Adventure'),
('Strategy');

-- =========================
-- Users
-- =========================
INSERT INTO users (username, email, password_hash) VALUES
('alice', 'alice@example.com', 'hash1'),
('bob', 'bob@example.com', 'hash2'),
('charlie', 'charlie@example.com', 'hash3');

-- =========================
-- Games
-- =========================
INSERT INTO games (title, release_year) VALUES
('Elden Ring', 2022),
('Hollow Knight', 2017),
('Stardew Valley', 2016),
('God of War Ragnarok', 2022);

-- =========================
-- Game ↔ Platforms
-- =========================
INSERT INTO game_platforms (game_id, platform_id) VALUES
(1, 1), -- Elden Ring -> PC
(1, 2), -- Elden Ring -> PS5
(2, 1), -- Hollow Knight -> PC
(2, 4), -- Hollow Knight -> Switch
(3, 1), -- Stardew Valley -> PC
(3, 4), -- Stardew Valley -> Switch
(4, 2); -- God of War Ragnarok -> PS5

-- =========================
-- Game ↔ Genres
-- =========================
INSERT INTO game_genres (game_id, genre_id) VALUES
(1, 1), -- Elden Ring -> RPG
(1, 2), -- Elden Ring -> Action
(2, 2), -- Hollow Knight -> Action
(2, 3), -- Hollow Knight -> Adventure
(3, 3), -- Stardew Valley -> Adventure
(3, 4), -- Stardew Valley -> Strategy
(4, 1), -- God of War Ragnarok -> RPG
(4, 2); -- God of War Ragnarok -> Action

-- =========================
-- Game Images
-- =========================
INSERT INTO game_images (game_id, url, type, description) VALUES
(1, 'https://example.com/eldenring_cover.jpg', 'cover', 'Cover art of Elden Ring'),
(1, 'https://example.com/eldenring_screenshot1.jpg', 'screenshot', 'Gameplay screenshot'),
(2, 'https://example.com/hollowknight_cover.jpg', 'cover', 'Cover art of Hollow Knight'),
(3, 'https://example.com/stardewvalley_cover.jpg', 'cover', 'Stardew Valley cover image'),
(4, 'https://example.com/gowr_cover.jpg', 'cover', 'God of War Ragnarok cover');

-- =========================
-- User Games (Backlog/Progress)
-- =========================
INSERT INTO user_games (user_id, game_id, status, rating, started_at, finished_at) VALUES
(1, 1, 'playing', NULL, '2023-08-01', NULL),
(1, 3, 'backlog', NULL, NULL, NULL),
(2, 2, 'completed', 9, '2022-01-10', '2022-02-15'),
(2, 4, 'backlog', NULL, NULL, NULL),
(3, 1, 'backlog', NULL, NULL, NULL);

-- =========================
-- Reviews
-- =========================
INSERT INTO reviews (user_id, game_id, title, content, rating) VALUES
(2, 2, 'Amazing!', 'Loved every moment of Hollow Knight.', 9),
(1, 1, 'Challenging but fun', 'Elden Ring is tough but rewarding.', 8),
(3, 4, 'Epic adventure', 'God of War Ragnarok exceeded expectations.', 10);
