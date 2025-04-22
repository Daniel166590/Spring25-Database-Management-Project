import React, { useEffect, useState } from "react";
import axios from "axios";

// Material‑UI components
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

// Your dashboard chrome
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

export default function Playlist() {
  const [songs, setSongs] = useState([]);
  const userId = localStorage.getItem("userId");
  const playlistId = localStorage.getItem("playlistId");

  // Load playlist if logged in
  useEffect(() => {
    if (!userId) return;
    axios
      .get(`http://localhost:3005/api/playlist?userId=${userId}`, {
        withCredentials: true,
      })
      .then((res) => {
        // assume API returns full song objects:
        setSongs(res.data);
      })
      .catch(console.error);
  }, [userId]);

  const handleRemove = (songId) => {
    axios
      .post(
        "http://localhost:3005/api/playlist/remove",
        { playlistId, songId },
        { withCredentials: true }
      )
      .then(() => {
        setSongs((prev) => prev.filter((s) => s.SongID !== songId));
      })
      .catch(console.error);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Your Playlist
        </Typography>

        {!userId ? (
          <Typography>Please log in to view your playlist.</Typography>
        ) : songs.length === 0 ? (
          <Typography>Your playlist is empty.</Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableBody>
                {songs.map((song) => (
                  <TableRow key={song.SongID}>
                    <TableCell>{song.Name}</TableCell>
                    <TableCell>{song.Genre}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleRemove(song.SongID)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {userId && (
          <Box mt={2}>
            <button onClick={handleLogout}>Log Out</button>
          </Box>
        )}
      </Box>
      <Footer />
    </DashboardLayout>
  );
}