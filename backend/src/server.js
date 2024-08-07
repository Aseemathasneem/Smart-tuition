// src/server.js

import connectDB from './config/db.js';
import server from './app.js';

// Connect to the database
connectDB();

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
