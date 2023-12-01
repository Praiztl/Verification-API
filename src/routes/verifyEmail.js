import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Endpoint to handle email verification
router.get('/verify-email/:token', async (req, res) => {
  const { token } = req.params;

  try {
    // Verify the token
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decodedToken.userId;

    // Update user's isVerified field to true
    await User.findByIdAndUpdate(userId, { isVerified: true });

    res.json({ message: 'Email verification successful. You can now log in.' });
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired verification token.' });
  }
});

export default router;
