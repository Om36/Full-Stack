const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json()); // for parsing JSON requests

// Dummy user for testing
const dummyUser = {
  username: "admin",
  password: "12345"
};

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (
    username === dummyUser.username &&
    password === dummyUser.password
  ) {
    res.json({ message: "Login successful!" });
  } else {
    res.status(401).json({ message: "Invalid credentials." });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
