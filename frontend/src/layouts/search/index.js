// layouts/search/index.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { Box, TextField, Typography, CircularProgress } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout"; // Import the layout container

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
      const response = await axios.get(`http://localhost:3005/api/search?q=${encodeURIComponent(searchTerm)}`);
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
        albums.map((album) => (
          <Box key={album.AlbumID} sx={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem", borderRadius: "4px" }}>
            <Typography variant="h6">{album.Title}</Typography>
            <Typography variant="subtitle1">by {album.ArtistName}</Typography>
            {album.Songs && album.Songs.length > 0 && (
              <Box component="ul" sx={{ paddingLeft: "1.5rem", marginTop: "0.5rem" }}>
                {album.Songs.map((song) => (
                  <li key={song.SongID}>
                    {song.Name} <em>({song.Genre})</em>
                  </li>
                ))}
              </Box>
            )}
          </Box>
        ))
      ) : (
        <Typography>{query.trim() !== "" ? "No results found." : "Type a search query above."}</Typography>
      )}
    </Box>
  );

  return (
    // Wrap the search page content in DashboardLayout so it respects the sidebar
    <DashboardLayout>
      {content}
    </DashboardLayout>
  );
}