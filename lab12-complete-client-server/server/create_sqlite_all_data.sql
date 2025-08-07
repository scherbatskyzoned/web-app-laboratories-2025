BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS films (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    favorite BOOLEAN NOT NULL CHECK (favorite IN (0, 1)),
    watchDate DATE,
    rating INTEGER CHECK (rating BETWEEN 0 AND 5)
);


INSERT INTO films (title, favorite, watchDate, rating) VALUES
('Pulp Fiction', 1, '2023-03-10', 5),
('21 Grams', 1, '2023-03-17', 4),
('Star Wars', 0, NULL, NULL),
('Matrix', 0, NULL, NULL),
('Shrek', 0, '2024-03-21', 2);

COMMIT;