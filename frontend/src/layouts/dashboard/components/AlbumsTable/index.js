// layouts/dashboard/components/AlbumsTable/index.js
import React, { useState, useEffect } from 'react';
import DataTable from 'examples/Tables/DataTable';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import axios from 'axios';

const AlbumsTable = () => {
  const [albums, setAlbums] = useState([]);
  const [expandedAlbum, setExpandedAlbum] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3005/api/albums?limit=100&offset=0')
      .then(response => setAlbums(response.data))
      .catch(err => console.error('Error fetching albums:', err));
  }, []);

  const columns = [
    { Header: 'Album Title', accessor: 'Title' },
    { Header: 'Artist', accessor: 'ArtistName' },
    { Header: 'Date Added', accessor: 'DateAdded' },
    { Header: 'Action', accessor: 'Action', width: '15%', align: 'center' },
  ];

  const rows = albums.map((album) => ({
    Title: (
      <MDTypography variant="caption" fontWeight="medium">
        {album.Title}
      </MDTypography>
    ),
    ArtistName: (
      <MDTypography variant="caption" color="text">
        {album.ArtistName}
      </MDTypography>
    ),
    DateAdded: new Date(album.DateAdded).toLocaleDateString(),
    Action: (
      <MDButton variant="outlined" size="small" onClick={() => setExpandedAlbum(expandedAlbum === album.AlbumID ? null : album.AlbumID)}>
        {expandedAlbum === album.AlbumID ? 'Hide Songs' : 'Show Songs'}
      </MDButton>
    ),
    Songs: album.Songs,
    AlbumID: album.AlbumID,
  }));

  return (
    <MDBox p={3}>
      <DataTable
        table={{ columns, rows }}
        entriesPerPage={false}
        showTotalEntries={false}
      />
      {expandedAlbum && (
        <MDBox mt={2} p={2} borderRadius="lg" bgColor="grey-100">
          <MDTypography variant="h6" mb={1}>Songs in Album</MDTypography>
          {albums.find(a => a.AlbumID === expandedAlbum)?.Songs.map(song => (
            <MDTypography key={song.SongID} variant="body2">
              🎵 {song.Name} - <i>{song.Genre}</i>
            </MDTypography>
          ))}
        </MDBox>
      )}
    </MDBox>
  );
};

export default AlbumsTable;