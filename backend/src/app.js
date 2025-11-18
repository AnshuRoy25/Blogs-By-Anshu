import express from 'express';
import cors from 'cors'; // Optional, add if you want to enable CORS

const app = express();

// Enable CORS middleware (optional)
app.use(cors());

// Middleware to parse JSON payloads
app.use(express.json());

// Define a basic route
app.get('/', (req, res) => {
  res.send('Hello from Node.js backend!');
});

export default app;
