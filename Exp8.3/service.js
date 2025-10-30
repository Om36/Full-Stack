// service.js (RBAC Authentication Service)
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());

// --- In-memory user store for demo ---
const users = [
  { id: 1, username: 'admin', password: bcrypt.hashSync('adminpass', 8), role: 'admin' },
  { id: 2, username: 'moderator', password: bcrypt.hashSync('modpass', 8), role: 'moderator' },
  { id: 3, username: 'user', password: bcrypt.hashSync('userpass', 8), role: 'user' }
];

// --- Secret key for JWT ---
const SECRET = 'MY_SUPER_SECRET_KEY';

// --- JWT Middleware ---
function authenticate(req, res, next) {
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token missing' });

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Token invalid or expired' });
    req.user = decoded;
    next();
  });
}

// --- Role Middleware ---
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role))
      return res.status(403).json({ message: `Access denied: allowed role(s) ${allowedRoles.join(', ')}` });
    next();
  };
}

// --- Auth Route ---
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);

  if (!user || !bcrypt.compareSync(password, user.password))
    return res.status(401).json({ message: 'Invalid credentials' });

  // Sign JWT: include role
  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET, { expiresIn: '1h' });
  res.json({ message: 'Login successful', token, role: user.role });
});

// --- Protected Routes ---
app.get('/admin/dashboard', authenticate, authorize('admin'), (req, res) => {
  res.json({ message: `Welcome Admin ${req.user.username}!` });
});

app.get('/moderator/panel', authenticate, authorize('admin', 'moderator'), (req, res) => {
  res.json({ message: `Welcome Moderator or Admin ${req.user.username}!` });
});

app.get('/user/profile', authenticate, authorize('admin', 'moderator', 'user'), (req, res) => {
  res.json({ message: `Welcome User ${req.user.username}!` });
});

// --- Health Check ---
app.get('/', (req, res) => res.send('RBAC Service Running'));

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`RBAC service running on port ${PORT}`));
