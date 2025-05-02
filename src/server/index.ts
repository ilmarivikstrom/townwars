import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port: number = 5173;

// Resolve __dirname in ES module context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.json());

// API endpoints
app.get('/api/time', (req, res) => {
  res.json({ message: Date.now().toString() });
});

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// Catch-all to serve index.html for SPA routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// WebSocket setup
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.send('Hello from the web socket!');
});

server.listen(port, () => {
  console.log(`Backend + frontend running at http://localhost:${port}`);
});
