// src/layouts/search/index.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { Box, TextField, Typography, CircularProgress } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSearchResults = async (searchTerm) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:3005/api/search?q=${encodeURIComponent(searchTerm)}`,
        { withCredentials: true }
      );
      setAlbums(response.data);
    } catch (err) {
      console.error("Error fetching search results:", err);
      setError("Failed to fetch search results.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (query.trim() !== "") {
      fetchSearchResults(query);
    } else {
      setAlbums([]);
    }
  }, [query]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const content = (
    <Box sx={{ padding: "1rem" }}>
      <Typography variant="h4" gutterBottom>
        Album Search
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        label="Search by album title or artist"
        value={query}
        onChange={handleInputChange}
        sx={{ marginBottom: "1rem" }}
      />
      {isLoading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : albums.length > 0 ? (
        albums.map((album) => {
          const songs = album.Songs || [];
          const midIndex = Math.ceil(songs.length / 2);
          const firstHalf = songs.slice(0, midIndex);
          const secondHalf = songs.slice(midIndex);

          return (
            <Box
              key={album.AlbumID}
              sx={{
                border: "1px solid #ccc",
                padding: "1rem",
                marginBottom: "1rem",
                borderRadius: "4px",
              }}
            >
              <Box display="flex" alignItems="flex-start" sx={{ gap: 2, flexWrap: "wrap" }}>
                {/* Left column: Album art */}
                {album.AlbumArt && (
                  <Box
                    component="img"
                    src={album.AlbumArt}
                    alt={`${album.Title} album art`}
                    sx={{
                      width: 400,
                      height: 400,
                      objectFit: "cover",
                      borderRadius: "4px",
                      flexShrink: 0,
                    }}
                  />
                )}

                {/* Right: title, artist, and two song columns */}
                <Box flex="1">
                  <Typography variant="h6">{album.Title}</Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    by {album.ArtistName}
                  </Typography>

                  {songs.length > 0 ? (
                    <Box display="flex" sx={{ gap: 2, mt: 1 }}>
                      {/* Middle column */}
                      <Box
                        component="ul"
                        sx={{ paddingLeft: "1.25rem", m: 0, flex: 1 }}
                      >
                        {firstHalf.map((song) => (
                          <li key={song.SongID}>
                            {song.Name} <em>({song.Genre})</em>
                          </li>
                        ))}
                      </Box>

                      {/* Rightmost column */}
                      <Box
                        component="ul"
                        sx={{ paddingLeft: "1.25rem", m: 0, flex: 1 }}
                      >
                        {secondHalf.map((song) => (
                          <li key={song.SongID}>
                            {song.Name} <em>({song.Genre})</em>
                          </li>
                        ))}
                      </Box>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No songs available.
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          );
        })
      ) : (
        <Typography>
          {query.trim() !== "" ? "No results found." : "Type a search query above."}
        </Typography>
      )}
    </Box>
  );

  return <DashboardLayout>{content}</DashboardLayout>;
}