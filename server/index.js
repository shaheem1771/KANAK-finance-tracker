import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import transactionRoutes from './routes/transactions.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Allow local dev origins (Vite may run on different localhost ports)
app.use(cors({ origin: (origin, callback) => callback(null, true) }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

mongoose.set('strictQuery', false);

const startServer = () => {
  app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
};

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    startServer();
  })
  .catch((error) => {
    console.warn('MongoDB connection failed, using in-memory fallback.');
    console.warn(error.message || error);
    startServer();
  });
