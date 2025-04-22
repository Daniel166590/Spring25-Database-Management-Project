// src/layouts/dashboard/components/AlbumsTable/index.js
import React, { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
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
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import AddIcon from "@mui/icons-material/Add";
import NowPlaying from "../NowPlaying";

// Renders a song row with play button only
function SongRow({ song, isPlaying, onToggle, onAdd }) {
  const handleClick = (e) => {
    e.stopPropagation();
    onToggle(song);
  };

  const handleAddClick = (e) => {
    e.stopPropagation();           // Prevent collapse toggle
    onAdd(song.SongID);            // Call parent to add to playlist
  };

  return (
    <Box mb={1} display="flex" alignItems="center">
      {song.ytlink && (
        <IconButton size="small" onClick={handleClick}>
          <PlayArrowIcon color={isPlaying ? "primary" : "inherit"} />
        </IconButton>
      )}
      <Typography variant="body2">
        🎵 {song.Name} <i>({song.Genre})</i>
      </Typography>
      <IconButton size="small" onClick={handleAddClick}>
+       <AddIcon />
+     </IconButton>
    </Box>
  );
}

export default function AlbumsTable() {
  const [albums, setAlbums] = useState([]);
  const [expandedAlbum, setExpandedAlbum] = useState(null);
  const [playingSong, setPlayingSong] = useState(null);
  const [sortKey, setSortKey] = useState("DateAdded");
  const [sortDirection, setSortDirection] = useState("desc");
  const tableRef = useRef(null);
  const [tableWidth, setTableWidth] = useState(0);

  // Fetch albums on mount
  useEffect(() => {
    axios
      .get("http://localhost:3005/api/albums?limit=100&offset=0", { withCredentials: true })
      .then((res) => setAlbums(res.data))
      .catch(console.error);
  }, []);

  // Track container width for NowPlaying bar
  useEffect(() => {
    const updateWidth = () => {
      if (tableRef.current) setTableWidth(tableRef.current.offsetWidth);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Toggle album expand/collapse
  const handleRowClick = (id) => {
    setExpandedAlbum((prev) => (prev === id ? null : id));
  };

  // Sorting handler (no longer clears playback)
  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const addToPlaylist = async (songId) => {
    try {
      // assume you stored the user’s playlistId in localStorage after login:
      const playlistId = localStorage.getItem("playlistId");
      await axios.post(
        "http://localhost:3005/api/playlist/add",
        { playlistId, songId },
        { withCredentials: true }
      );
      // maybe show a toast/success indicator here
    } catch (err) {
      console.error("Add to playlist failed", err);
    }
  };

  // Apply sorting
  const sortedAlbums = useMemo(() => {
    return [...albums].sort((a, b) => {
      const av =
        sortKey === "DateAdded" ? new Date(a[sortKey]) : a[sortKey].toLowerCase();
      const bv =
        sortKey === "DateAdded" ? new Date(b[sortKey]) : b[sortKey].toLowerCase();
      if (av < bv) return sortDirection === "asc" ? -1 : 1;
      if (av > bv) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [albums, sortKey, sortDirection]);

  return (
    <>
      <TableContainer ref={tableRef}>
        <Table sx={{ width: "100%", tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: 50 }} />
            <col style={{ width: 70 }} />
            <col />
            <col />
            <col style={{ width: 160 }} />
          </colgroup>
          <TableBody>
            {/* Header Row */}
            <TableRow>
              <TableCell />
              <TableCell sx={{ textAlign: "center" }}>Art</TableCell>
              <TableCell onClick={() => handleSort("Title")} sx={{ cursor: "pointer" }}>
                <Box display="flex" alignItems="center">
                  <Typography sx={{ fontWeight: "bold" }}>Album Title</Typography>
                  {sortKey === "Title" &&
                    (sortDirection === "asc" ? (
                      <ArrowUpwardIcon fontSize="small" />
                    ) : (
                      <ArrowDownwardIcon fontSize="small" />
                    ))}
                </Box>
              </TableCell>
              <TableCell onClick={() => handleSort("ArtistName")} sx={{ cursor: "pointer" }}>
                <Box display="flex" alignItems="center">
                  <Typography sx={{ fontWeight: "bold" }}>Artist</Typography>
                  {sortKey === "ArtistName" &&
                    (sortDirection === "asc" ? (
                      <ArrowUpwardIcon fontSize="small" />
                    ) : (
                      <ArrowDownwardIcon fontSize="small" />
                    ))}
                </Box>
              </TableCell>
              <TableCell onClick={() => handleSort("DateAdded")} sx={{ cursor: "pointer" }}>
                <Box display="flex" alignItems="center">
                  <Typography sx={{ fontWeight: "bold" }}>Date Added</Typography>
                  {sortKey === "DateAdded" &&
                    (sortDirection === "asc" ? (
                      <ArrowUpwardIcon fontSize="small" />
                    ) : (
                      <ArrowDownwardIcon fontSize="small" />
                    ))}
                </Box>
              </TableCell>
            </TableRow>

            {/* Album Rows */}
            {sortedAlbums.map((album) => (
              <React.Fragment key={album.AlbumID}>
                <TableRow
                  hover
                  onClick={() => handleRowClick(album.AlbumID)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell sx={{ textAlign: "center", p: 0 }}>
                    <IconButton size="small">
                      {expandedAlbum === album.AlbumID ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", p: 1 }}>
                    {album.AlbumArt ? (
                      <img
                        src={album.AlbumArt}
                        alt={album.Title}
                        style={{
                          width: 60,
                          height: 60,
                          objectFit: "cover",
                          borderRadius: 4,
                        }}
                      />
                    ) : (
                      <Typography variant="caption">No Art</Typography>
                    )}
                  </TableCell>
                  <TableCell>{album.Title}</TableCell>
                  <TableCell>{album.ArtistName}</TableCell>
                  <TableCell>
                    {new Date(album.DateAdded).toLocaleDateString()}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell colSpan={5} sx={{ p: 0 }}>
                    <Collapse
                      in={expandedAlbum === album.AlbumID}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box
                        m={2}
                        display="flex"
                        alignItems="flex-start"
                        sx={{ overflowX: "auto" }}
                      >
                        {/* Large Album Art */}
                        <Box
                          component="img"
                          src={album.AlbumArt}
                          alt={album.Title}
                          sx={{
                            width: 200,
                            height: 200,
                            objectFit: "cover",
                            borderRadius: 1,
                            flexShrink: 0,
                            mr: 2,
                          }}
                        />

                        {/* Song Columns */}
                        <Box display="flex" flex="1" gap={2}>
                          {(() => {
                            const songs = album.Songs || [];
                            const mid = Math.ceil(songs.length / 2);
                            return [songs.slice(0, mid), songs.slice(mid)].map(
                              (half, idx) => (
                                <Box key={idx} flex="1">
                                  {half.map((song) => (
                                    <SongRow
                                      key={song.SongID}
                                      song={song}
                                      isPlaying={playingSong?.SongID === song.SongID}
                                      onToggle={(s) =>
                                        setPlayingSong((prev) =>
                                          prev?.SongID === s.SongID ? null : s
                                        )
                                      }
                                      onAdd={addToPlaylist}
                                    />
                                  ))}
                                </Box>
                              )
                            );
                          })()}
                        </Box>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <NowPlaying
        song={playingSong}
        onStop={() => setPlayingSong(null)}
        width={tableWidth}
      />
    </>
  );
}