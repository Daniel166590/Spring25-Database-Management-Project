# Mooflixz



A full-stack music streaming web app built with React, Node.js/Express, and MySQL.

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

---

## About

Mooflixz is a lightweight music streaming application that allows users to browse albums, search tracks, and play media directly in the browser. It combines a React-powered frontend with a Node.js/Express backend serving a MySQL database of artists, albums, and tracks.

---

## Features

- Browse and filter albums
- Full-text search for tracks and artists
- User authentication and sessions
- Stream audio and display album art

---

## Tech Stack

- **Frontend:** React, React Router, Material-UI (or your UI library of choice)
- **Backend:** Node.js, Express.js
- **Database:** MySQL (managed via MySQL Workbench and SQL scripts)
- **ORM / Querying:** Custom query functions in `queryFunctions.js`
- **Authentication:** Passport.js with Azure OAuth and session management
- **Deployment:** Docker / CI definitions (optional)

---

## Repository Structure

```
.
├── LICENSE
├── README.md           ← this file
├── backend             ← Main server code
│   ├── api             ← Separate initialization scripts (one-time DB load only)
│   │   ├── Javatest.js  ← DB config for loader
│   │   └── test.js      ← Run once to populate tables
│   ├── auth.js
│   ├── database        ← SQL schema scripts
│   │   ├── CreateDB.sql ← create schema & tables
│   │   ├── ClearDB.sql  ← optional cleanup
│   │   ├── LoadDB.sql   ← empty; data loaded via test.js
│   │   ├── Query_m.sql
│   │   └── tempData.sql
│   ├── db.js           ← MySQL connection setup
│   ├── media           ← uploaded or seed media files
│   ├── package.json
│   ├── package-lock.json
│   ├── queryFunctions.js
│   ├── requirements.txt
│   ├── routes
│   │   ├── albums.js
│   │   └── search.js
│   ├── routes.js       ← central routing for live API
│   └── server.js       ← entry point for live API
├── frontend            ← React client app
│   ├── CHANGELOG.md
│   ├── ISSUE_TEMPLATE.md
│   ├── LICENSE.md
│   ├── jsconfig.json
│   ├── package.json
│   ├── package-lock.json
│   ├── public          ← static HTML/CSS/JS
│   └── src             ← React source code
│       ├── App.js
│       ├── index.js
│       ├── components
│       ├── context
│       ├── layouts
│       └── routes.js
└── legacy              ← old HTML/CSS prototypes
    ├── about.html
    ├── webPage.html
    ├── style.css
    └── *.jpg
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v14+
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/)
- [MySQL Workbench](https://www.mysql.com/products/workbench/)
- Visual Studio Code (Recommended)
- Two Terminal Windows (Recommended)

---

### Backend Setup

1. **Install dependencies**  
   ```bash
   cd backend
   npm install
   ```
2. **Create MySQL database and schema**  
   - In MySQL Workbench, open a new SQL tab.  
   - Run the following to create and switch to the database (replace `mooflixz_db` with your preferred name if desired):  
     ```sql
     CREATE DATABASE IF NOT EXISTS mooflixz_db;
     USE mooflixz_db;
     ```  
3. **Create tables**  
   - In the same SQL tab, copy and paste the entire contents of `backend/database/CreateDB.sql` and execute it to create all required tables.  
4. **Populate initial data (one-time)**  
   - The `/backend/api` folder contains separate scripts solely for loading the database at setup:
     - Update your DB credentials in `backend/api/Javatest.js`.
          ```js
           const connection = mysql.createConnection({
             host: 'localhost', // Update this with your database host
             user: 'root',      // Your MySQL username
             password: '', // Your MySQL password
             database: 'mooflixz_db', // Your database name
             port: 3306         // Your MySQL port, default is usually 3306
           });
           ```
     - Run the loader script once (This will fetch music data from Spotify and YouTube to fill your tables):
       ```bash
       node backend/api/test.js
       ```
         - When the terminal appears to be stuck, that means we've run out of tokens and will have to ^C to exit the script

   **Important:** Before starting the backend server, update the pool configuration in `backend/db.js` with your MySQL host, port, user, password, and database name to match your environment.

5. **Update your database config for the backend and start**
      **Example configuration in `backend/api/Javatest.js`:**
       ```js
        const pool = mysql.createPool({
          host: '127.0.0.1',
          port: 3306,
          user: 'root',
          password: '', // Adjust if your MySQL password isn't empty
          database: 'mooflixz_db',
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0
        });
       ``` 
       ```bash
       npm start
       ```
   The backend server will run at `http://localhost:3005` by default.

---

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```
2. **Run the client**
   ```bash
   npm start
   ```
   Opens at `http://localhost:3000`. No additional configuration needed.

---

## Usage

- Register or log in to access player controls
- Browse albums on the “Albums” page
- Search by artist or track via the search bar
- Click a track to play it in the embedded player

---

## API Endpoints

| Method | Endpoint             | Description                              |
| ------ | -------------------- | ---------------------------------------- |
| `GET`  | `/api/albums`        | List all albums                          |
| `GET`  | `/api/albums/:id`    | Get album details + tracks               |
| `GET`  | `/api/search?q=...`  | Full-text search for artists & tracks    |
| `POST` | `/api/auth/login`    | Authenticate user, return session cookie |
| `POST` | `/api/auth/register` | Create new user account                  |

*(See ********`backend/routes/`******** for full details.)*

---

## Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feat/YourFeature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to your branch (`git push origin feat/YourFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the [MIT License](LICENSE).

