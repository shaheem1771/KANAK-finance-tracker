import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = express.Router();
const users = new Map();

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Missing name, email, or password.' });
  }

  if (users.has(email)) {
    return res.status(409).json({ message: 'User already exists.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.set(email, { email, name, password: hashedPassword });

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ token, user: { email, name } });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.get(email);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { email: user.email, name: user.name } });
});

export default router;
