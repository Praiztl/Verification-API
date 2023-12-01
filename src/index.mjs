import dotenv from 'dotenv';
import connectDB from './db.js';

import express from 'express';
import verifyEmailRoutes from './routes/verifyEmail.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3002;
// Connect to MongoDB
connectDB();

// Parse JSON request body
app.use(express.json());

// Define verification route
app.use('/verify-email', verifyEmailRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Verification Server started on port ${PORT}`);
});

export default app;