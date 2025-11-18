import http from 'http';
import app from './app.js';
import connectDB from './utils/db.js';
import config from './config/config.js';

const PORT = config.port || 3000;

const server = http.createServer(app);

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('Failed to connect to the database:', error);
});
