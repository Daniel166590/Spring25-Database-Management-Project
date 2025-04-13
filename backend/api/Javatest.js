const SpotifyWebApi = require('spotify-web-api-node');
const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'localhost', // Update this with your database host
  user: 'root', // Your MySQL username
  password: 'Prospero11@1', // Your MySQL password
  database: 'for_project' // Your database name
});
const spotifyApi = new SpotifyWebApi({
  clientId: 'c1f9261253864ff7a177b0f34a9ad293',
  clientSecret: '4285302837aa4f3c82e686ea5a54224c',
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
  constructor(name, album, year){
    this.name = name;
    this.album = album;
    this.year = year;
  }
}
class Album{
  constructor(name, id,year){
    this.name = name;
    this.id = id;
    this.year = year; }
}
class submit{
  constructor(list_of_artists){
    this.list = list_of_artists
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
async function searchAlbums(artistName){
    try{
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body.access_token);
    const result = await spotifyApi.getArtistAlbums(artistName);
    //console.log('Albums \n');
    let albums_list = [];
    result.body.items.forEach((album,i) => {
      let albums = new Album(album.name, album.id, album.release_date);
        //console.log(`${i+1}. ${album.name} (${album.release_date})`);
        albums_list.push(albums);
    })
    return albums_list;
    } catch (error) {
        console.error("You fucked up homie", error);
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
    connection.query('INSERT INTO Artist (name, genre) VALUES (?, ?)', [name, genre], (err, result) => {
      if (err) {
        reject("Error inserting artist: " + err);
      } else {
        resolve(result.insertId); // Return the artist_id
      }
    });
  });
}

async function insertAlbum(artistId, name, year) {
  return new Promise((resolve, reject) => {
    connection.query('INSERT INTO artist_album (ArtistId, Title, dateadded) VALUES (?, ?, ?)', 
    [artistId, name, year], (err, result) => {
      if (err) {
        reject("Error inserting album: " + err);
      } else {
        resolve(result.insertId); // Return the album_id
      }
    });
  });
}

async function insertSong(artistid, albumId, name,genre, year) {
  return new Promise((resolve, reject) => {
    connection.query('INSERT INTO song (ArtistId,AlbumId, name, genre, datecreated) VALUES (?, ?, ?, ?, ?)', 
    [artistid,albumId, name, genre, year], (err, result) => {
      if (err) {
        reject("Error inserting song: " + err);
      } else {
        resolve(result.insertId); // Return the song_id
      }
    });
  });
}

async function getAllArtistInfo() {
  const artistarray = [
    'Powerwolf', 'Tyler the Creator', 'Kristofer Maddigan', 'Queen', 'jmbeatz', 'TRASHBABYDISTRO', 'Frank Sinatra'
  ];

  for (let i = 0; i < artistarray.length; i++) {
    const { id, genre } = await searchArtist(artistarray[i]);
    const album_info = await searchAlbums(id);
    const album_id = album_info.map(a => a.id);
    const song_list = await GetTracks(album_id);

    // Insert artist data separately
    try {
      const artistId = await insertArtist(artistarray[i], genre);
      console.log(`Inserted artist: ${artistarray[i]} with ID: ${artistId}`);

      for (const album of album_info) {
        // Insert album data separately
        const albumId = await insertAlbum(artistId, album.name, album.year);
        console.log(`Inserted artist_album: ${album.name} with ID: ${albumId}`);

        // Insert song data separately for each album
        for (const song of song_list) {
          if (song.album === album.name) {
            await insertSong(artistId,albumId, song.name, genre, song.year);
            console.log(`Inserted song: ${song.name}`);
          }
        }
      }
      console.log(`${i + 1} is Done`);
    } catch (error) {
      console.error("Error inserting data:", error);
    }
  }
}

module.exports = { getAllArtistInfo };