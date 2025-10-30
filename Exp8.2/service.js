const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = "mysecret"; // Change for production
const sampleUser = { username: "testuser", password: "password123" };

// Login - POST /login, returns JWT.
app.post("/login", (req, res) => {
  // Guard against missing/invalid JSON body. If req.body is undefined
  // the destructuring below would throw — return a helpful 400 instead.
  if (!req.body) {
    return res.status(400).json({ error: "Request body is missing. Make sure 'Content-Type: application/json' header is set and a valid JSON body is sent." });
  }

  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Both "username" and "password" are required in the request body.' });
  }

  if (username === sampleUser.username && password === sampleUser.password) {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
    return res.json({ token });
  }

  res.status(401).json({ error: "Invalid credentials" });
});

// JWT Middleware for protected routes.
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = decoded;
    next();
  });
}

// Example protected route.
app.get("/protected", verifyToken, (req, res) => {
  res.json({ message: `Hello, ${req.user.username}! Access granted.` });
});

// Root route - helpful message to avoid 'Cannot GET /' when someone visits the base URL
app.get('/', (req, res) => {
  res.send('Auth server is running. Use POST /login to obtain a token, then GET /protected with Authorization: Bearer <token>.');
});

// Start server.
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Auth server running on port ${PORT}`);
});
