// layouts/dashboard/components/AlbumsTable/index.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Collapse,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

// Row component: renders header row if isHeader is true, else a normal album row with expandable content.
function AlbumRow({ album, isExpanded, toggleExpand, isHeader }) {
  return (
    <>
      <TableRow
        hover={!isHeader}
        onClick={!isHeader ? toggleExpand : undefined}
        sx={{ cursor: !isHeader ? "pointer" : "default" }}
      >
        <TableCell sx={{ textAlign: "center", p: 0, width: "50px" }}>
          {isHeader ? (
            // Render an empty cell for the header (could also put a symbol if desired)
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>&nbsp;</Typography>
          ) : (
            <IconButton size="small">
              {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
        </TableCell>
        <TableCell>
          {isHeader ? (
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Album Title
            </Typography>
          ) : (
            album.Title
          )}
        </TableCell>
        <TableCell>
          {isHeader ? (
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Artist
            </Typography>
          ) : (
            album.ArtistName
          )}
        </TableCell>
        <TableCell sx={{ width: "160px" }}>
          {isHeader ? (
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Date Added
            </Typography>
          ) : (
            new Date(album.DateAdded).toLocaleDateString()
          )}
        </TableCell>
      </TableRow>

      {/* Expanded row for songs: only for non-header rows */}
      {!isHeader && (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <Box margin={2}>
                <Typography variant="h6" gutterBottom>
                  Songs in {album.Title}
                </Typography>
                {album.Songs && album.Songs.length > 0 ? (
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
      )}
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
    setExpandedAlbum(expandedAlbum === albumId ? null : albumId);
  };

  return (
    <TableContainer>
      <Table
        sx={{
          width: "100%",
          tableLayout: "fixed",
        }}
      >
        <colgroup>
          <col style={{ width: "50px" }} />
          <col />
          <col />
          <col style={{ width: "160px" }} />
        </colgroup>
        <TableBody>
          {/* Render the header row as a normal row with isHeader set */}
          <AlbumRow isHeader={true} />
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