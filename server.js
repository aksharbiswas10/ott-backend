const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend
app.use('/', express.static(path.join(__dirname, '../frontend')));

// Load movies.json
const getMovies = () => JSON.parse(fs.readFileSync(path.join(__dirname, 'movies.json')));

// In-memory drive link mapping (hidden from frontend)
const driveLinks = {
  ballerina2025: "https://drive.google.com/file/d/1krvp8Y0ktL6lxkmbEYn6SeI7TWO_5hPI/preview"
};

// API: Get all movies
app.get('/api/movies', (req, res) => {
  res.json(getMovies());
});

// API: Get single movie by ID
app.get('/api/movies/:id', (req, res) => {
  const movie = getMovies().find(m => m.id === req.params.id);
  res.json(movie || {});
});

// 🔒 Stream route: Hide real Google Drive link
app.get('/stream/:id', (req, res) => {
  const id = req.params.id;
  const realUrl = driveLinks[id];
  if (!realUrl) return res.status(404).send("Movie not found");

  // Optional: Pipe proxy content in future
  // For now, simple redirect (still hides real link in UI)
  res.redirect(realUrl);
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ OTT server running at http://localhost:${PORT}`);
});
