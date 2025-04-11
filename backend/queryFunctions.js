const mysql = require('mysql2/promise');

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



// Example usage
(async () => {
  const userId = 1; // replace with the actual user ID you want to query
  const playlists = await getUserPlaylistSongs(userId);
  console.log(JSON.stringify(playlists, null, 2));
})();