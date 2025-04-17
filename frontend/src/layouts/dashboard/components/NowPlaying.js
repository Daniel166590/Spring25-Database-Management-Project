// src/components/NowPlaying.js
import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ReactPlayer from "react-player";

export default function NowPlaying({ song, onStop, width = 600 }) {
  if (!song) return null;

  // Convert YouTube watch link → embed + autoplay
  const embedUrl = song.ytlink.replace("watch?v=", "embed/") + "?autoplay=1";

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 16,
        left: `calc(50% - ${width / 5}px)`,
        width: `${width/1.5}px`,
        height: 100,               // fixed slim height
        bgcolor: "background.paper",
        opacity: 100,
        boxShadow: 3,
        borderRadius: 1,
        px: 5,                    // horizontal padding only
        display: "flex",
        alignItems: "center",     // vertically center contents
        justifyContent: "space-between",
        zIndex: 1300,
      }}
    >
      {/* Song info + close */}
      <Box display="flex" alignItems="center" flex="1" mr={2}>
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
          width: 240,    // small player width
          height: 100,    // small player height
          flexShrink: 0,
        }}
      >
        <ReactPlayer
          url={embedUrl}
          playing
          controls
          volume={0.5}
          width="100%"
          height="100%"
          style={{ position: "absolute", top: 0, left: 0 }}
          config={{ youtube: { playerVars: { modestbranding: 1, rel: 0 } } }}
        />
      </Box>
    </Box>
  );
}