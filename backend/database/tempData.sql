INSERT INTO ARTIST (Name, Genre, Biography)
VALUES 
  ('The Harmonics', 'Rock', 'An up-and-coming rock band with electrifying performances.'),
  ('Soulful Echoes', 'R&B', 'Smooth vocals and deep grooves blending classic and modern R&B.'),
  ('Jazz Ventures', 'Jazz', 'A collective of jazz musicians exploring creative improvisation.');
  
INSERT INTO ARTIST_ALBUM (ArtistID, Title)
VALUES 
  (1, 'Electric Dreams'),
  (1, 'Summer Beats'),
  (2, 'Soulful Nights'),
  (3, 'Blue Notes'),
  (3, 'Jazz Adventures');
  
INSERT INTO SONG (ArtistID, AlbumID, Name, Genre)
VALUES 
  -- Songs for "Electric Dreams" (AlbumID = 1, ArtistID = 1)
  (1, 1, 'Dreaming Awake', 'Rock'),
  (1, 1, 'Electric Pulse', 'Rock'),
  (1, 1, 'Night Drive', 'Rock'),

  -- Songs for "Summer Beats" (AlbumID = 2, ArtistID = 1)
  (1, 2, 'Sunset Ride', 'Rock'),
  (1, 2, 'Warm Vibes', 'Rock'),

  -- Songs for "Soulful Nights" (AlbumID = 3, ArtistID = 2)
  (2, 3, 'Midnight Soul', 'R&B'),
  (2, 3, 'Soft Whispers', 'R&B'),
  (2, 3, 'Lover''s Tune', 'R&B'),

  -- Songs for "Blue Notes" (AlbumID = 4, ArtistID = 3)
  (3, 4, 'Deep Blue', 'Jazz'),
  (3, 4, 'Smooth Jazz', 'Jazz'),

  -- Songs for "Jazz Adventures" (AlbumID = 5, ArtistID = 3)
  (3, 5, 'Road Trip', 'Jazz'),
  (3, 5, 'City Swing', 'Jazz'),
  (3, 5, 'Late Night Groove', 'Jazz');