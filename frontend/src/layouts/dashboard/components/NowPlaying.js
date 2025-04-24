// src/components/NowPlaying.js
import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ReactPlayer from "react-player";

export default function NowPlaying({ song, onStop }) {
  if (!song) return null;

  // Convert YouTube watch link → embed + autoplay
  const embedUrl = song.ytlink.replace("watch?v=", "embed/") + "?autoplay=1";

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 16,
        left: "50%",
        transform: "translateX(-50%)", // centers horizontally
        width: "50%", // takes 50% of the width
        maxWidth: 8000, // optional max-width for large screens
        minWidth: 650, // optional min-width for small screens
        height: 70,
        bgcolor: "background.paper",
        boxShadow: 3,
        borderRadius: 3, // rounded corners
        px: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 1300,
      }}
    >
      {/* Song info + close */}
      <Box display="flex" alignItems="center" flex={1} overflow="hidden" mr={2}>
        <Typography noWrap sx={{ fontWeight: "bold", mr: 2 }}>
          {song.Name}
        </Typography>
        <Typography noWrap color="text.secondary">
          ({song.Genre})
        </Typography>
      </Box>
      <IconButton size="small" onClick={onStop} sx={{ mr: 2 }}>
        <CloseIcon />
      </IconButton>

      {/* Mini player */}
      <Box
        sx={{
          position: "relative",
          width: 480,
          height: 200,
          flexShrink: 0,
          bottom: 15,
        }}
      >
        <ReactPlayer
          url={embedUrl}
          playing
          controls
          volume={0.5}
          width="100%"
          height="100%"
          style={{ position: "absolute", top: -48, left: 0 }}
          config={{ youtube: { playerVars: { modestbranding: 1, rel: 0 } } }}
        />
      </Box>
    </Box>
  );
}
