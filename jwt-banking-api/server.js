import express from 'express';
import jwt from 'jsonwebtoken';
const app = express();
app.use(express.json());
const PORT = 3001;
const SECRET_KEY = 'supersecretkey';
const USER = { username: 'user1', password: 'password123', balance: 1000 };

// Root endpoint
app.get('/', (req, res) => {
res.json({
message: 'JWT Banking API Server',
status: 'Running',
port: PORT,
availableEndpoints: {
  test: 'GET /test',
  login: 'POST /login',
  balance: 'GET /balance (requires token)',
  deposit: 'POST /deposit (requires token)',
  withdraw: 'POST /withdraw (requires token)'
}
});
});

function authenticateToken(req, res, next) {
const authHeader = req.headers['authorization'];
if (!authHeader) return res.status(401).json({ message: 'Authorization header missing' });
const token = authHeader.split(' ')[1];
if (!token) return res.status(401).json({ message: 'Token missing' });
jwt.verify(token, SECRET_KEY, (err, user) => {
if (err) return res.status(403).json({ message: 'Invalid token' });
req.user = user;
next();
});
}
app.post('/login', (req, res) => {
console.log('Request body:', req.body);
console.log('Request headers:', req.headers);

if (!req.body) {
return res.status(400).json({ message: 'Request body is missing. Make sure to send JSON data with Content-Type: application/json header.' });
}

const { username, password } = req.body;
if (username === USER.username && password === USER.password) {
const token = jwt.sign({ username: USER.username }, SECRET_KEY, {
expiresIn: '1h' });
res.json({ token });
} else {
res.status(401).json({ message: 'Invalid credentials' });
}
});

// Test endpoints - can be accessed via browser (GET) or Postman (POST)
app.get('/test', (req, res) => {
res.json({ 
message: 'JWT Banking API is running!', 
endpoints: {
  login: 'POST /login',
  balance: 'GET /balance (requires token)',
  deposit: 'POST /deposit (requires token)',
  withdraw: 'POST /withdraw (requires token)'
},
testCredentials: {
  username: 'user1',
  password: 'password123'
}
});
});

app.post('/test', (req, res) => {
res.json({ 
message: 'POST test successful!', 
body: req.body,
note: 'This confirms POST requests are working properly'
});
});

app.get('/balance', authenticateToken, (req, res) => res.json({ balance:
USER.balance }));
app.post('/deposit', authenticateToken, (req, res) => {
const { amount } = req.body;
if (!amount || amount <= 0) return res.status(400).json({ message:
'Invalid amount' });
USER.balance += amount;
res.json({ message: `Deposited ${amount}`, balance: USER.balance });
});
app.post('/withdraw', authenticateToken, (req, res) => {
const { amount } = req.body;
if (!amount || amount <= 0) return res.status(400).json({ message:
'Invalid amount' });
if (amount > USER.balance) return res.status(400).json({ message:
'Insufficient balance' });
USER.balance -= amount;
res.json({ message: `Withdrew ${amount}`, balance: USER.balance });
});
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));