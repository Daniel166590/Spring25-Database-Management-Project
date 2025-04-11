const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: 'c1f9261253864ff7a177b0f34a9ad293',
  clientSecret: '4285302837aa4f3c82e686ea5a54224c',
});
var id = 0
async function searchArtist(artistName) {
  try {
    // First: Retrieve an access token
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body.access_token);
    // Then: Search for artist
    const result = await spotifyApi.searchArtists(artistName);
    const firstArtist = result.body.artists.items[0];
    id = firstArtist.id;
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
    let list_ids = [];
    result.body.items.forEach((album,i) => {
        console.log(`${i+1}. ${album.name} (${album.release_date})`);
        list_ids.push(album.id);
    })
    return list_ids;
    } catch (error) {
        console.error("You fucked up homie", error);
    }
}
async function GetTracks(album_Ids){
    try{
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body.access_token);
    for(const albumid of album_Ids){
    const Albumdets = await spotifyApi.getAlbum(albumid);
    const albumname = Albumdets.body.name;
    console.log(`Track in ${albumname}:`)
    const result = await spotifyApi.getAlbumTracks(albumid);
    result.body.items.forEach((track,i) => {
        console.log(`${i+1}. ${track.name}`);
    });
        console.log(`\n`);
}  
    } catch (error) {
        console.error("You fucked up homie", error);
    }
}
async function searchAll() {
  
}
async function main(){
await searchArtist('Queen');
console.log(id);
const album_id = await searchAlbums(id);
console.log("Album ID:", album_id);
await GetTracks(album_id);
}

main();