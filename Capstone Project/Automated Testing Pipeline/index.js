const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const routes = require('./routes/api');
require('dotenv').config();

const app = express();

const port = process.env.PORT || 5000;

// Resolve MongoDB URI from common env names and provide a local fallback for dev
const mongoUri = process.env.MONGO_DB_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/dev_db';

// Connect to the database
mongoose
    .connect(mongoUri)
    .then(() => console.log(`Database connected successfully`))
    .catch((err) => console.error('Mongo connection error:', err));

// Since mongoose's Promise is deprecated, we override it with Node's Promise
mongoose.Promise = global.Promise;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(bodyParser.json());

app.use('/api', routes);

app.use((err, req, res, next) => {
    console.log(err);
    next();
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client', 'dist')));

// Handle all other routes by returning the React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Start the server bound to localhost (IPv4) and add error handling
const server = app.listen(port, '127.0.0.1', () => {
    console.log(`Server running on port ${port}`);
});

server.on('error', (err) => {
    console.error('Server failed to start:', err);
    // If address in use, log more info
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use. Ensure no other process is listening on this port.`);
    }
    process.exit(1);
});

process.on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception thrown:', err);
    process.exit(1);
});