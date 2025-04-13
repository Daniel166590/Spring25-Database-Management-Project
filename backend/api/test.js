const {getAllArtistInfo} = require('./Javatest');

(async () => {
  const artists = await getAllArtistInfo();
  //console.log(artists.list[0].albums[0].name);  // Access year of first album of first artist
})();