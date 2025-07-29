// routes/token.js
import express from 'express';
import UserToken from '../models/UserToken.model.js';

const router = express.Router();

router.post('/save-token', async (req, res) => {
  const { userId, token } = req.body;
  if (!userId || !token) return res.status(400).json({ error: 'Missing data' });

  await UserToken.findOneAndUpdate({ userId }, { token }, { upsert: true, new: true });
  res.status(200).json({ message: 'Token saved' });
});

export default router;
