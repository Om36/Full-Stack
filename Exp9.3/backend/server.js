const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Simple API route
app.get('/api', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
