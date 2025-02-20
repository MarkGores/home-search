// backend/index.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.send('Backend is up and running!');
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));