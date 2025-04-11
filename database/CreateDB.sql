CREATE TABLE USER (
    UserID      BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    Username    VARCHAR(30) NOT NULL UNIQUE, 
    Email       VARCHAR(254) NOT NULL UNIQUE,
    Password    VARCHAR(255) NOT NULL,  -- For securely storing hashed passwords
    DateJoined  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE USER_PLAYLIST (
    PlaylistID  BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    UserID      BIGINT UNSIGNED NOT NULL,
    Title       VARCHAR(100) NOT NULL, -- Allowing longer playlist names
    DateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES USER(UserID) ON DELETE CASCADE
);

CREATE TABLE LIKED (
    UserID  BIGINT UNSIGNED NOT NULL,
    SongID  BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (UserID, SongID),  -- Composite key prevents duplicate likes
    FOREIGN KEY (UserID) REFERENCES USER(UserID) ON DELETE CASCADE,
    FOREIGN KEY (SongID) REFERENCES SONG(SongID) ON DELETE CASCADE
);

CREATE TABLE ARTIST (
    ArtistID    BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    Name        VARCHAR(100) NOT NULL UNIQUE,
    Genre       VARCHAR(50),
    Biography   TEXT,
    DateJoined  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ARTIST_ALBUM (
    AlbumID     BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    ArtistID    BIGINT UNSIGNED NOT NULL,
    Title       VARCHAR(100) NOT NULL,
    DateAdded   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ArtistID) REFERENCES ARTIST(ArtistID) ON DELETE CASCADE
);

CREATE TABLE SONG (
    SongID      BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    ArtistID    BIGINT UNSIGNED NOT NULL,
    AlbumID     BIGINT UNSIGNED,
    Name        VARCHAR(100) NOT NULL,
    Genre       VARCHAR(50),
    DateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ArtistID) REFERENCES ARTIST(ArtistID) ON DELETE CASCADE,
    FOREIGN KEY (AlbumID) REFERENCES ARTIST_ALBUM(AlbumID) ON DELETE SET NULL
);

CREATE TABLE PLAYLIST_SONGS (
    PlaylistID BIGINT UNSIGNED,
    SongID BIGINT UNSIGNED,
    PRIMARY KEY (PlaylistID, SongID),
    FOREIGN KEY (PlaylistID) REFERENCES USER_PLAYLIST(PlaylistID),
    FOREIGN KEY (SongID) REFERENCES SONG(SongID)
);

CREATE INDEX idx_user_email ON USER(Email);
CREATE INDEX idx_artist_name ON ARTIST(Name);
CREATE INDEX idx_song_name ON SONG(Name);