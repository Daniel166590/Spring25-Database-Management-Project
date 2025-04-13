const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: 'c1f9261253864ff7a177b0f34a9ad293',
  clientSecret: '4285302837aa4f3c82e686ea5a54224c',
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
var id = 0
var genre = '';
async function searchArtist(artistName) {
  try {
    // First: Retrieve an access token
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body.access_token);
    // Then: Search for artist
    const result = await spotifyApi.searchArtists(artistName);
    const firstArtist = result.body.artists.items[0];
    id = firstArtist.id;
   genre = firstArtist.genres[0];
    console.log(result.body.artists.items[0]);
  } catch (error) {
    console.error('Error with Spotify API:', error);
  }
}
async function searchAlbums(artistName){
    try{
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body.access_token);
    const result = await spotifyApi.getArtistAlbums(artistName);
    console.log('Albums \n');
    let albums_list = [];
    result.body.items.forEach((album,i) => {
      let albums = new Album(album.name, album.id, album.release_date);
        console.log(`${i+1}. ${album.name} (${album.release_date})`);
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
    console.log(`Track in ${albumname}:`)
    const result = await spotifyApi.getAlbumTracks(albumid);
    result.body.items.forEach((track,i) => {
        console.log(`${i+1}. ${track.name}`);
        song = new Songs(track.name, albumname, albumyear);
        //console.log(song);
        songs.push(song);
    });
      console.log(`\n`);
}  
    return songs;
    } catch (error) {
        console.error("You fucked up homie", error);
    }
}
async function main(){
const ArrayofArtistinfo = [];
const artistarray = [
  // Metal/Rock
  'Powerwolf',
  'Metallica',
  'Nightwish',
  'Bring Me The Horizon',
  'Muse',
  'Radiohead',
  'Arctic Monkeys',
  'The Killers',
  'Foo Fighters',
  'Paramore',

  // Pop
  'Dua Lipa',
  'Ariana Grande',
  'Taylor Swift',
  'Olivia Rodrigo',
  'Harry Styles',
  'Ed Sheeran',
  'Shawn Mendes',
  'Billie Eilish',
  'Doja Cat',
  'The Weeknd',

  // Hip-Hop/Rap
  'Drake',
  'Kendrick Lamar',
  'J. Cole',
  'Travis Scott',
  'Nicki Minaj',
  'Megan Thee Stallion',
  'Tyler, The Creator',
  '21 Savage',
  'Post Malone',
  'SZA',

  // Electronic
  'ODESZA',
  'Flume',
  'Calvin Harris',
  'Zedd',
  'Skrillex',
  'Deadmau5',
  'Fred again..',
  'Kygo',
  'Daft Punk',
  'Marshmello',

  // Indie/Alternative/Folk
  'Bon Iver',
  'Fleet Foxes',
  'The Lumineers',
  'Phoebe Bridgers',
  'Tame Impala',

  // Country / Soul / Funk
  'Chris Stapleton', 'Kacey Musgraves', 'Sturgill Simpson','Leon Bridges', 'Vulfpeck'
];

for(let i = 0; i < artistarray.length; i++){
await searchArtist(artistarray[i]);
//console.log(id);
const album_info = await searchAlbums(id);

//console.log("Album ID:", album_id); used for debugging 
album_id = album_info.map(a =>a.id);
const song_list =  await GetTracks(album_id);
//console.log(song_list); //  used for debugging

//console.log(this_artist.name);

this_artist = new Artist(artistarray[i],i+1, id, genre,album_info, song_list);
ArrayofArtistinfo.push(this_artist);
//console.log(genre);
}

}

main();