const SpotifyWebApi = require('spotify-web-api-node');
const mysql = require('mysql2');
require('dotenv').config();
// Create a connection to the database
const connection = mysql.createConnection({
  host: 'localhost', // Update this with your database host
  user: 'root', // Your MySQL username
  password: '', // Your MySQL password
  database: 'Spring25_Database_Management_Project', //'Spring25_Database_Management_Project', // Your database name
  port: 3307 // Your MySQL port, default is usually 3306
});
const spotifyApi = new SpotifyWebApi({
  clientId: '2d04cb15fa944b838588a89c9f961026',
  clientSecret: '373bbdde2ef7461e9f6500ba5a9e10bc',
});
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to the database as id ' + connection.threadId);
});
class Artist{
  constructor(name, id,spot_id,genre,albums, tracks){
    this.name = name;
    this.id = id;
    this.spot_id = spot_id;
    this.genre = genre;
    this.albums = albums;
    this.tracks = tracks;
  }
}
class Songs{
  constructor(name, album, year, ytlink){
    this.name = name;
    this.album = album;
    this.year = year;
    this.ytlink = ytlink;
  }
}
class Album {
  constructor(name, id, year, art) {
    this.Title = name;
    this.AlbumID = id;
    this.year = year;
    this.AlbumArt = art; // This must match the property you're checking in the frontend.
  }
}
class submit{
  constructor(list_of_artists){
    this.list = list_of_artists
  }
}
const axios = require('axios');

// Get the YouTube video link
// No dotenv neede

const YOUTUBE_API_KEY = 'AIzaSyD5ulpAI-5W7PM3gstgva5n2s_krwg0PMg'; // <- hardcoded

async function getYouTubeLink(songName, artistName) {
  try {
    const query = `${songName} ${artistName} official audio`;

    const res = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: query,
        key: YOUTUBE_API_KEY,
        maxResults: 1,
        type: 'video'
      }
    });

    const video = res.data.items[0];
    if (!video) return null;

    return `https://www.youtube.com/watch?v=${video.id.videoId}`;
  } catch (err) {
    console.error('Error fetching YouTube link:', err.response?.data || err);
    return null;
  }
}


async function searchArtist(artistName) {
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body.access_token);

    // Search for the artist
    const result = await spotifyApi.searchArtists(artistName);
    const firstArtist = result.body.artists.items[0];

    return { id: firstArtist.id, genre: firstArtist.genres[0] }; // Return the id and genre
  } catch (error) {
    console.error('Error with Spotify API:', error);
  }
}
async function searchAlbums(artistId) {
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body.access_token);

    const result = await spotifyApi.getArtistAlbums(artistId);

    if (!result.body || !result.body.items) {
      console.error("No album items returned. Response body:", result.body);
      return [];
    }

    // Map using 'album.name' and safeguard images in case it's empty.
    const albums_list = result.body.items.map(album => 
      new Album(
        album.name,                    // Use album.name instead of album.Title
        album.id,
        album.release_date,
        album.images && album.images[0] ? album.images[0].url : null
      )
    );
    return albums_list;
  } catch (error) {
    if (error.statusCode === 429) {
      console.error("Rate limited by Spotify. Please try again later. Retry-After:", error.headers && error.headers['retry-after']);
    } else {
      console.error("Spotify API error:", error);
    }
    return []; // Return empty array so downstream code handles it gracefully.
  }
}
async function GetTracks(album_Ids){
    try{
    songs = [];
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body.access_token);
    for(const albumid of album_Ids){
    const Albumdets = await spotifyApi.getAlbum(albumid);
    const albumname = Albumdets.body.name;
    const albumyear = Albumdets.body.release_date;
    //console.log(`Track in ${albumname}:`)
    const result = await spotifyApi.getAlbumTracks(albumid);
    result.body.items.forEach((track,i) => {
        //console.log(`${i+1}. ${track.name}`);
        song = new Songs(track.name, albumname, albumyear);
        //console.log(song);
        songs.push(song);
    });
      //console.log(`\n`);
}  
    return songs;
    } catch (error) {
        console.error("You fucked up homie", error);
    }
}
async function insertArtist(name, genre) {
  return new Promise((resolve, reject) => {
    const insertQuery = 'INSERT INTO Artist (Name, Genre) VALUES (?, ?)';

    connection.query(insertQuery, [name, genre], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          // Fetch existing artist ID
          const selectQuery = 'SELECT ArtistID FROM Artist WHERE Name = ?';
          connection.query(selectQuery, [name], (selectErr, selectResult) => {
            if (selectErr) return reject("Error finding existing artist: " + selectErr);
            if (selectResult.length > 0) {
              const artistId = selectResult[0].ArtistID;

              // DELETE old albums and songs tied to the artist
              const deleteSongsQuery = 'DELETE FROM song WHERE ArtistId = ?';
              const deleteAlbumsQuery = 'DELETE FROM artist_album WHERE ArtistId = ?';

              connection.query(deleteSongsQuery, [artistId], (err1) => {
                if (err1) return reject("Error deleting songs: " + err1);

                connection.query(deleteAlbumsQuery, [artistId], (err2) => {
                  if (err2) return reject("Error deleting albums: " + err2);

                  // Optionally, update the genre
                  const updateQuery = 'UPDATE Artist SET Genre = ? WHERE ArtistID = ?';
                  connection.query(updateQuery, [genre, artistId], (err3) => {
                    if (err3) return reject("Error updating artist: " + err3);
                    console.log(`Updated and cleaned artist: ${name}`);
                    resolve(artistId);
                  });
                });
              });
            } else {
              return reject("Duplicate but couldn't find existing artist.");
            }
          });
        } else {
          return reject("Error inserting artist: " + err);
        }
      } else {
        resolve(result.insertId);
      }
    });
  });
}



async function insertAlbum(artistId, name, images, year) {
  return new Promise((resolve, reject) => {
    const insertQuery = 'INSERT INTO artist_album (ArtistId, Title, AlbumArt, dateadded) VALUES (?, ?, ?, ?)';
    
    connection.query(insertQuery, [artistId, name, images, year], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          const selectQuery = 'SELECT AlbumId FROM artist_album WHERE ArtistId = ? AND Title = ?';
          connection.query(selectQuery, [artistId, name], (selectErr, selectResult) => {
            if (selectErr) return reject("Error finding existing album: " + selectErr);
            if (selectResult.length > 0) {
              console.log(`Duplicate album found: ${name}, using existing ID ${selectResult[0].AlbumId}`);
              return resolve(selectResult[0].AlbumId);
            } else {
              return reject("Duplicate but couldn't find existing album.");
            }
          });
        } else {
          return reject("Error inserting album: " + err);
        }
      } else {
        resolve(result.insertId);
      }
    });
  });
}


async function insertSong(artistid, albumId, name, genre, year, ytlink) {
  return new Promise((resolve, reject) => {
    const insertQuery = 'INSERT INTO song (ArtistId, AlbumId, name, genre, datecreated, ytlink) VALUES (?, ?, ?, ?, ?, ?)';
    
    connection.query(insertQuery, [artistid, albumId, name, genre, year, ytlink], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          const selectQuery = 'SELECT SongId FROM song WHERE AlbumId = ? AND name = ?';
          connection.query(selectQuery, [albumId, name], (selectErr, selectResult) => {
            if (selectErr) return reject("Error finding existing song: " + selectErr);
            if (selectResult.length > 0) {
              console.log(`Duplicate song found: ${name}, using existing ID ${selectResult[0].SongId}`);
              return resolve(selectResult[0].SongId);
            } else {
              return reject("Duplicate but couldn't find existing song.");
            }
          });
        } else {
          return reject("Error inserting song: " + err);
        }
      } else {
        resolve(result.insertId);
      }
    });
  });
}



async function getAllArtistInfo() {
  const artistarray = [
    'Powerwolf', 'Tyler the Creator', 'Kristofer Maddigan', 'Queen', 
    'jmbeatz', 'TRASHBABYDISTRO', 'Frank Sinatra'
  ];

  const fullArtistData = [];

  for (let i = 0; i < artistarray.length; i++) {
    const artistName = artistarray[i];
    const artistResult = await searchArtist(artistName);
    if (!artistResult) {
      console.error(`No artist data returned for ${artistName}`);
      continue;
    }
    const { id, genre } = artistResult;
    const album_info = await searchAlbums(id);
    if (!album_info || album_info.length === 0) {
      console.error(`No album info returned for artist ${artistName}`);
      continue;
    }
    const album_ids = album_info.map(a => a.AlbumID);
    const song_list = await GetTracks(album_ids);

    try {
      const artistId = await insertArtist(artistName, genre);
      console.log(`Inserted artist: ${artistName} with ID: ${artistId}`);
      const albumsForArtist = [];

      for (const album of album_info) {
        const albumId = await insertAlbum(artistId, album.Title, album.AlbumArt, album.year);
        console.log(`Inserted album: ${album.Title} with ID: ${albumId}`);
        const songsForAlbum = [];

        for (const song of song_list) {
          if (song.album === album.Title) {
            const ytlink = await getYouTubeLink(song.name, artistName);
            await insertSong(artistId, albumId, song.name, genre, song.year, ytlink);
            songsForAlbum.push(new Songs(song.name, song.album, song.year, ytlink));
          }
        }

        const albumObj = new Album(album.Title, albumId, album.year, album.AlbumArt);
        albumObj.songs = songsForAlbum;
        albumsForArtist.push(albumObj);
      }

      const artistObj = new Artist(artistName, artistId, id, genre, albumsForArtist, song_list);
      fullArtistData.push(artistObj);

      console.log(`${i + 1} is Done`);
    } catch (error) {
      console.error("Error inserting data:", error);
    }
  }

  return new submit(fullArtistData); // Submit wraps the artist list
}


module.exports = { getAllArtistInfo };