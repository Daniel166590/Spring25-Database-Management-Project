// layouts/dashboard/components/AlbumsTable/index.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPlayer from "react-player";
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

// SongRow: displays song line, play toggle, and inline player
function SongRow({ song, isPlaying, onToggle }) {
  const handleClick = (e) => {
    e.stopPropagation(); // prevent album collapse toggle
    onToggle();
  };

  return (
    <Box mb={1}>
      <Box display="flex" alignItems="center">
        {song.ytlink && (
          <IconButton size="small" onClick={handleClick}>
            <PlayArrowIcon color={isPlaying ? "primary" : "inherit"} />
          </IconButton>
        )}
        <Typography variant="body2">
          🎵 {song.Name} <i>({song.Genre})</i>
        </Typography>
      </Box>

      {song.ytlink && (
        <Collapse in={isPlaying} timeout="auto" unmountOnExit>
          <Box mt={1} sx={{ position: "relative", paddingTop: "56.25%" }}>
            <ReactPlayer
              url={song.ytlink}
              playing={isPlaying}
              controls
              volume={0.5}
              width="100%"
              height="100%"
              style={{ position: "absolute", top: 0, left: 0 }}
            />
          </Box>
        </Collapse>
      )}
    </Box>
  );
}

// AlbumRow: renders header or album data and expanded song list
function AlbumRow({ album, isExpanded, toggleExpand, isHeader, playingSongId, setPlayingSongId }) {
  // toggle handler for a given song
  const handleSongToggle = (songId) => {
    setPlayingSongId((prev) => (prev === songId ? null : songId));
  };

  return (
    <>
      <TableRow
        hover={!isHeader}
        onClick={!isHeader ? toggleExpand : undefined}
        sx={{ cursor: !isHeader ? "pointer" : "default" }}
      >
        <TableCell sx={{ textAlign: "center", p: 0, width: "50px" }}>
          {isHeader ? (
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>&nbsp;</Typography>
          ) : (
            <IconButton size="small">
              {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
        </TableCell>

        <TableCell sx={{ width: "70px", textAlign: "center", p: 1 }}>
          {isHeader ? (
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>Art</Typography>
          ) : album.AlbumArt ? (
            <img
              src={album.AlbumArt}
              alt={album.Title}
              style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "4px" }}
            />
          ) : (
            <Typography variant="caption">No Art</Typography>
          )}
        </TableCell>

        <TableCell>
          {isHeader ? (
            <Typography sx={{ fontWeight: "bold" }}>Album Title</Typography>
          ) : (
            album.Title
          )}
        </TableCell>

        <TableCell>
          {isHeader ? (
            <Typography sx={{ fontWeight: "bold" }}>Artist</Typography>
          ) : (
            album.ArtistName
          )}
        </TableCell>

        <TableCell sx={{ width: "160px" }}>
          {isHeader ? (
            <Typography sx={{ fontWeight: "bold" }}>Date Added</Typography>
          ) : (
            new Date(album.DateAdded).toLocaleDateString()
          )}
        </TableCell>
      </TableRow>

      {!isHeader && (
        <TableRow>
          <TableCell colSpan={5} sx={{ p: 0 }}>
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <Box m={2} display="flex" alignItems="flex-start" sx={{ overflowX: "auto" }}>
                <Box
                  component="img"
                  src={album.AlbumArt}
                  alt={album.Title}
                  sx={{ width: 200, height: 200, objectFit: "cover", borderRadius: 1, flexShrink: 0, mr: 2 }}
                />
                <Box display="flex" flex="1" gap={2}>
                  {(() => {
                    const songs = album.Songs || [];
                    const mid = Math.ceil(songs.length / 2);
                    const firstHalf = songs.slice(0, mid);
                    const secondHalf = songs.slice(mid);
                    return (
                      <>
                        <Box flex="1">
                          {firstHalf.map((song) => (
                            <SongRow
                              key={song.SongID}
                              song={song}
                              isPlaying={playingSongId === song.SongID}
                              onToggle={() => handleSongToggle(song.SongID)}
                            />
                          ))}
                        </Box>
                        <Box flex="1">
                          {secondHalf.map((song) => (
                            <SongRow
                              key={song.SongID}
                              song={song}
                              isPlaying={playingSongId === song.SongID}
                              onToggle={() => handleSongToggle(song.SongID)}
                            />
                          ))}
                        </Box>
                      </>
                    );
                  })()}
                </Box>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

// AlbumsTable: top-level component managing album expansion & playingSongId
export default function AlbumsTable() {
  const [albums, setAlbums] = useState([]);
  const [expandedAlbum, setExpandedAlbum] = useState(null);
  const [playingSongId, setPlayingSongId] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3005/api/albums?limit=100&offset=0", { withCredentials: true })
      .then((res) => setAlbums(res.data))
      .catch(console.error);
  }, []);

  const handleRowClick = (id) => setExpandedAlbum((prev) => (prev === id ? null : id));

  return (
    <TableContainer>
      <Table sx={{ width: "100%", tableLayout: "fixed" }}>
        <colgroup>
          <col style={{ width: "50px" }} />
          <col style={{ width: "70px" }} />
          <col />
          <col />
          <col style={{ width: "160px" }} />
        </colgroup>
        <TableBody>
          <AlbumRow isHeader />
          {albums.map((album) => (
            <AlbumRow
              key={album.AlbumID}
              album={album}
              isExpanded={expandedAlbum === album.AlbumID}
              toggleExpand={() => handleRowClick(album.AlbumID)}
              playingSongId={playingSongId}
              setPlayingSongId={setPlayingSongId}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
