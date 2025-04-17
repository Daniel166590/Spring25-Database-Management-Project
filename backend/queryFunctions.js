const mysql = require('mysql2/promise');

const pool = require('./db');
/*
// Database connection setup
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',         // change if you use a different user
  password: '',         // change if your MySQL user has a password
  database: 'musicapp', // replace with your actual DB name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
*/
// Function to get playlists and their song IDs for a given user
async function getUserPlaylistSongs(userId) {
  const connection = await pool.getConnection();
  try {
    // Query all playlists for the user
    const [playlists] = await connection.execute(
      `SELECT PlaylistID, Title FROM USER_PLAYLIST WHERE UserID = ?`,
      [userId]
    );

    const result = [];

    for (const playlist of playlists) {
      const [songs] = await connection.execute(
        `SELECT SongID FROM PLAYLIST_SONGS WHERE PlaylistID = ?`,
        [playlist.PlaylistID]
      );

      result.push({
        playlistId: playlist.PlaylistID,
        title: playlist.Title,
        songIds: songs.map(row => row.SongID)
      });
    }

    return result;
  } catch (err) {
    console.error('Database error:', err);
    return [];
  } finally {
    connection.release();
  }
}

//Add a song to a user's playlist
async function addSongToPlaylist(playlistId, songId) {
    const connection = await pool.getConnection();
    try {
      await connection.execute(
        `INSERT INTO PLAYLIST_SONGS (PlaylistID, SongID) VALUES (?, ?)`,
        [playlistId, songId]
      );
      console.log(`Song ${songId} added to playlist ${playlistId}`);
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        console.log('This song is already in the playlist.');
      } else {
        console.error('Error adding song:', err);
      }
    } finally {
      connection.release();
    }
  }
  
//Remove a song from a user's playlist
async function removeSongFromPlaylist(playlistId, songId) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      `DELETE FROM PLAYLIST_SONGS WHERE PlaylistID = ? AND SongID = ?`,
      [playlistId, songId]
    );

    if (result.affectedRows === 0) {
      console.log('Song not found in playlist.');
    } else {
      console.log(`Song ${songId} removed from playlist ${playlistId}`);
    }
  } catch (err) {
    console.error('Error removing song:', err);
  } finally {
    connection.release();
  }
}

//function that returns all of the song ids in a certain genre. 
async function getSongsByGenre(genre) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(
      `SELECT SongID FROM SONG WHERE Genre = ?`,
      [genre]
    );

    return rows.map(row => row.SongID); //returns song ids
  } catch (err) {
    console.error('Error retrieving songs by genre:', err);
    return [];
  } finally {
    connection.release();
  }
}

//function to return all of the song ids of songs made by a certain artist. 
async function getSongsByArtistName(artistName) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(
      `SELECT SONG.SongID, SONG.Name AS SongName
       FROM SONG
       JOIN ARTIST ON SONG.ArtistID = ARTIST.ArtistID
       WHERE ARTIST.Name = ?`,
      [artistName]
    );

    return rows.map(row => row.SongID); //returns song ids
  } catch (err) {
    console.error('Error retrieving songs by artist name:', err);
    return [];
  } finally {
    connection.release();
  }
}

// Fetch albums along with artist names and their songs
async function getAlbumsWithSongs(limit = 100, offset = 0) {
  const sqlAlbums = `
    SELECT 
      ARTIST_ALBUM.AlbumID,
      ARTIST_ALBUM.Title AS AlbumTitle,
      ARTIST_ALBUM.AlbumArt,    -- New column for album art URL
      ARTIST.Name AS ArtistName,
      ARTIST_ALBUM.DateAdded
    FROM ARTIST_ALBUM
    JOIN ARTIST ON ARTIST.ArtistID = ARTIST_ALBUM.ArtistID
    ORDER BY ARTIST_ALBUM.DateAdded DESC
    LIMIT ? OFFSET ?;
  `;

  try {
    const [albums] = await pool.query(sqlAlbums, [limit, offset]);

    if (albums.length === 0) return [];

    const albumIds = albums.map(album => album.AlbumID);

    const sqlSongs = `
      SELECT SongID, AlbumID, Name, Genre
      FROM SONG
      WHERE AlbumID IN (?);
    `;

    const [songs] = await pool.query(sqlSongs, [albumIds]);

    const albumMap = {};
    albums.forEach(album => {
      albumMap[album.AlbumID] = {
        AlbumID: album.AlbumID,
        Title: album.AlbumTitle,
        ArtistName: album.ArtistName,
        DateAdded: album.DateAdded,
        AlbumArt: album.AlbumArt, // New property for album art URL
        Songs: [],
      };
    });

    songs.forEach(song => {
      if (albumMap[song.AlbumID]) {
        albumMap[song.AlbumID].Songs.push(song);
      }
    });

    return Object.values(albumMap);
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

async function searchAlbums(searchTerm, limit = 100, offset = 0) {
  const connection = await pool.getConnection();
  try {
    const safeLimit  = parseInt(limit, 10);
    const safeOffset = parseInt(offset, 10);
    const likeTerm   = `%${searchTerm}%`;

    // 1) Albums matching title or artist
    const albumQuery = `
      SELECT ARTIST_ALBUM.AlbumID
      FROM ARTIST_ALBUM
      JOIN ARTIST
        ON ARTIST.ArtistID = ARTIST_ALBUM.ArtistID
      WHERE ARTIST_ALBUM.Title LIKE ?
         OR ARTIST.Name      LIKE ?
    `;
    const [albumRows] = await connection.execute(albumQuery, [likeTerm, likeTerm]);

    // 2) Albums matching song name
    const songQuery = `
      SELECT DISTINCT AlbumID
      FROM SONG
      WHERE Name LIKE ?
        AND AlbumID IS NOT NULL
    `;
    const [songRows] = await connection.execute(songQuery, [likeTerm]);

    // 3) Combine unique AlbumIDs
    const albumIdSet = new Set([
      ...albumRows.map(r => r.AlbumID),
      ...songRows.map(r => r.AlbumID),
    ]);

    if (albumIdSet.size === 0) return [];

    const albumIds = Array.from(albumIdSet);

    // 4) Fetch full album details (with art & artist), applying limit/offset
    const albumsSql = `
      SELECT 
        aa.AlbumID,
        aa.Title    AS AlbumTitle,
        aa.AlbumArt,
        ar.Name     AS ArtistName,
        aa.DateAdded
      FROM ARTIST_ALBUM aa
      JOIN ARTIST       ar
        ON ar.ArtistID = aa.ArtistID
      WHERE aa.AlbumID IN (? )
      ORDER BY aa.DateAdded DESC
      LIMIT ${safeLimit} OFFSET ${safeOffset}
    `;
    const [albums] = await connection.query(albumsSql, [albumIds]);

    // 5) Pull in all songs for those albums
    const songsSql = `
      SELECT SongID, AlbumID, Name, Genre
      FROM SONG
      WHERE AlbumID IN (?);
    `;
    const [songs] = await connection.query(songsSql, [albumIds]);

    // 6) Build your response structure
    const albumMap = {};
    for (const alb of albums) {
      albumMap[alb.AlbumID] = {
        AlbumID:    alb.AlbumID,
        Title:      alb.AlbumTitle,
        ArtistName: alb.ArtistName,
        DateAdded:  alb.DateAdded,
        AlbumArt:   alb.AlbumArt,
        Songs:      [],
      };
    }
    for (const s of songs) {
      if (albumMap[s.AlbumID]) albumMap[s.AlbumID].Songs.push(s);
    }

    return Object.values(albumMap);
  } catch (error) {
    console.error("Database query error in searchAlbums:", error);
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = { getAlbumsWithSongs,searchAlbums };

// Example usage
/*(async () => {
  const userId = 1; // replace with the actual user ID you want to query
  const playlists = await getUserPlaylistSongs(userId);
  console.log(JSON.stringify(playlists, null, 2));
})();*/