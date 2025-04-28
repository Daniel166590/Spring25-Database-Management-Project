# Mooflixz

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

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

Mooflixz is a lightweight music streaming application that allows users to browse albums, search tracks, and play media directly in the browser. It combines a React-powered SPA frontend with a Node.js/Express backend serving a MySQL database of artists, albums, and tracks.

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
├── backend             ← Express API + MySQL setup
│   ├── api             ← database loading script
│   │   ├── Javatest.js  ← adjust DB config here
│   │   └── test.js      ← run to populate tables
│   ├── auth.js
│   ├── database        ← raw SQL scripts
│   │   ├── CreateDB.sql ← create schema & tables
│   │   ├── ClearDB.sql  ← (optional cleanup)
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
│   ├── routes.js       ← central routing
│   └── server.js       ← entry point
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

---

### Backend Setup

1. **Install dependencies**  
   ```bash
   cd backend
   npm install
   ```
2. **Create the MySQL database schema**  
   - In MySQL Workbench, connect to your local server and create a schema, e.g., `mooflixz_db`.  
3. **Create tables**  
   - Execute the `database/CreateDB.sql` script in MySQL Workbench:  
     ```sql
     SOURCE database/CreateDB.sql;
     ```
4. **Populate initial data**  
   - Adjust the database connection settings inside `backend/api/Javatest.js` to match your schema credentials.  
   - Run the loader script:  
     ```bash
     node backend/api/test.js
     ```
   This will insert sample data into your tables.  
5. **Environment variables**  
   - Create a `.env` file at the root of `/backend` with only the following authentication values (no need to secure for a student project):  
     ```env
     AZURE_TENANT_ID=9cd14d1e-18c0-4d92-9795-050c68512445
     AZURE_CLIENT_ID=d286c814-fcfd-4094-b5cb-401212932a54
     AZURE_CLIENT_SECRET=bbe21f54-e809-4774-8bf2-0be01c1fb2b3
     AZURE_REDIRECT_URI=http://localhost:3005/dashboard
     SESSION_SECRET=99d79b30-8e7b-4cf9-90be-108c695cffcf
     ```
6. **Start the server**  
   ```bash
   npm start
   ```
   The API will be available at `http://localhost:3001` by default.

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

| Method | Endpoint            | Description                             |
| ------ | --------------------| --------------------------------------- |
| `GET`  | `/api/albums`       | List all albums                         |
| `GET`  | `/api/albums/:id`   | Get album details + tracks              |
| `GET`  | `/api/search?q=...` | Full-text search for artists & tracks   |
| `POST` | `/api/auth/login`   | Authenticate user, return session cookie|
| `POST` | `/api/auth/register`| Create new user account                 |

*(See `backend/routes/` for full details.)*

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

