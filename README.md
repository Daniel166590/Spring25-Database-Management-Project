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

### File Structure Overview
   ```bash
Spring25-Database-Management-Project/
│── backend/                 # Django backend
│   ├── manage.py            # Django project management script
│   ├── requirements.txt     # Dependencies
│   ├── db.sqlite3           # Default database (or PostgreSQL/MySQL in production)
│   ├── backend/             # Main Django app
│   │   ├── __init__.py
│   │   ├── settings.py      # Django settings (configure for React & CORS)
│   │   ├── urls.py          # API endpoints
│   │   ├── views.py         # API logic
│   │   ├── models.py        # Database models
│   │   ├── serializers.py   # Convert DB models to JSON
│   │   ├── admin.py         # Admin panel setup
│   │   ├── tests.py         # Unit tests
│   │   └── migrations/      # Database migrations
│   ├── api/                 # Django Rest Framework (DRF) API
│   │   ├── __init__.py
│   │   ├── urls.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── permissions.py
│   │   ├── authentication.py
│   │   └── tests.py
│   ├── static/              # Static files (if needed)
│   ├── templates/           # Templates (if using Django for pages)
│   └── media/               # Uploaded media files
│
│── frontend/                # React frontend
│   ├── public/              # Public assets
│   ├── src/                 # Source files
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page views
│   │   ├── services/        # API calls to Django backend
│   │   ├── App.js           # Main React app component
│   │   ├── index.js         # React root
│   │   ├── styles/          # Styling (CSS, SCSS, Tailwind)
│   ├── package.json         # Frontend dependencies
│   ├── .env                 # Environment variables (API URLs, etc.)
│   ├── vite.config.js       # (If using Vite instead of CRA)
│   ├── webpack.config.js    # (If using Webpack)
│   ├── tailwind.config.js   # (If using Tailwind CSS)
│   └── node_modules/        # Dependencies
│
│── .gitignore               # Ignore unnecessary files
│── README.md                # Documentation
│── docker-compose.yml       # Optional: Containerized setup
│── .env                     # Environment variables for backend/frontend
│── scripts/                 # Deployment/management scripts
└── docs/                    # Documentation
   ```

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

## License

This project is licensed under the MIT License.

