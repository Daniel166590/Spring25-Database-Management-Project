# Music Database System

## Overview

Welcome to the **Music Database System**! This project is a web-based platform designed to manage music-related data, including users, artists, playlists, albums, and songs. The system is designed to support two types of users — **Normal Users** and **Artist Users** — each with different levels of database access and functionality.

## Features

### Current Features

- Database schema design with MySQL.
- Basic frontend layout (HTML/CSS/JavaScript).
- Support for two user types:
  - **Normal Users**: Can create playlists, like songs, and browse music.
  - **Artist Users**: Can manage their own artist profile, albums, and songs.
- Timestamp-based tracking for record creation.

### Upcoming Features

- User registration and authentication system.
- Role-based access control.
- Playlist management (add, edit, delete playlists).
- Song search and filtering.
- Artist biography management.

## Database Schema

The system uses a MySQL relational database with the following tables:

### User Tables

- `USER`: Stores user information (username, email, password, user type, date joined).
- `USER_PLAYLIST`: Links users to their playlists.
- `LIKED`: Tracks songs liked by users.

### Artist Tables

- `ARTIST`: Stores artist information (name, genre, biography, date joined).
- `ARTIST_ALBUM`: Stores albums created by artists.

### Music Tables

- `SONG`: Stores information about songs, including references to albums and artists.

### Relationships

- One-to-Many: `ARTIST` to `ARTIST_ALBUM`
- One-to-Many: `ARTIST_ALBUM` to `SONG`
- Many-to-Many: `USER` to `SONG` (via `LIKED`)

## Installation

### Prerequisites

- MySQL
- Node.js (for future backend functionality)
- Git

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/music-database-system.git
   ```
2. Set up the MySQL database with the provided schema.
3. Install dependencies (coming soon).
4. Run the frontend application (coming soon).

## Usage

1. Sign up as a **Normal User** or **Artist User**.
2. Create playlists and like songs (Normal User).
3. Add artist information and upload songs (Artist User).

## Contributing

Contributions are welcome! Please open an issue or submit a pull request with your changes.

## License

This project is licensed under the MIT License.

## Contact

For questions or suggestions, feel free to reach out to [Your Name] at [Your Email].

