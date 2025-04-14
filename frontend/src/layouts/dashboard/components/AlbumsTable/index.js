// layouts/dashboard/components/AlbumsTable/index.js
import React, { useState, useEffect } from "react";
import axios from "axios";

// Material-UI components
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

function AlbumRow({ album, isExpanded, toggleExpand }) {
  return (
    <>
      {/* Main row: narrow first cell with arrow icon */}
      <TableRow hover onClick={toggleExpand} sx={{ cursor: "pointer" }}>
        <TableCell sx={{ textAlign: "center", p: 0 }}>
          <IconButton size="small">
            {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{album.Title}</TableCell>
        <TableCell>{album.ArtistName}</TableCell>
        <TableCell>{new Date(album.DateAdded).toLocaleDateString()}</TableCell>
      </TableRow>

      {/* Expanded row for songs */}
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Box m={2}>
              <Typography variant="h6" gutterBottom>
                Songs in {album.Title}
              </Typography>
              {album.Songs?.length ? (
                album.Songs.map((song) => (
                  <Typography key={song.SongID} variant="body2">
                    🎵 {song.Name} – <i>{song.Genre}</i>
                  </Typography>
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No songs available.
                </Typography>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function AlbumsTable() {
  const [albums, setAlbums] = useState([]);
  const [expandedAlbum, setExpandedAlbum] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3005/api/albums?limit=100&offset=0")
      .then((response) => setAlbums(response.data))
      .catch((err) => console.error("Error fetching albums:", err));
  }, []);

  const handleRowClick = (albumId) => {
    setExpandedAlbum((prev) => (prev === albumId ? null : albumId));
  };

  return (
    <TableContainer>
      {/* Fix table layout & define column widths */}
      <Table
        sx={{
          width: "100%",
          tableLayout: "fixed", // Ensures columns keep assigned widths
        }}
      >
        <colgroup>
          {/* Arrow column: 50px */}
          <col style={{ width: "50px" }} />
          {/* Let the next 2 columns auto-size */}
          <col />
          <col />
          {/* Date column might be narrower or also auto */}
          <col style={{ width: "160px" }} />
        </colgroup>

        <TableHead>
          <TableRow>
            {/* Empty header for the arrow column */}
            <TableCell sx={{ textAlign: "center", p: 0 }} />
            <TableCell>Album Title</TableCell>
            <TableCell>Artist</TableCell>
            <TableCell>Date Added</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {albums.map((album) => (
            <AlbumRow
              key={album.AlbumID}
              album={album}
              isExpanded={expandedAlbum === album.AlbumID}
              toggleExpand={() => handleRowClick(album.AlbumID)}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}