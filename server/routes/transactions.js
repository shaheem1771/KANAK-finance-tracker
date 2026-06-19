import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const router = express.Router();
const { Schema, model } = mongoose;

const transactionSchema = new Schema({
  userEmail: { type: String, required: true },
  date: { type: Date, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  note: String,
}, { timestamps: true });

const Transaction = model('Transaction', transactionSchema);
const inMemoryTransactions = [];

function isDbConnected() {
  return mongoose.connection.readyState === 1;
}

function formatTransaction(transaction) {
  return {
    id: transaction._id?.toString?.() ?? transaction.id,
    date: transaction.date,
    category: transaction.category,
    amount: transaction.amount,
    type: transaction.type,
    note: transaction.note,
    userEmail: transaction.userEmail,
    createdAt: transaction.createdAt ?? new Date(),
    updatedAt: transaction.updatedAt ?? new Date()
  };
}

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

router.use(authMiddleware);

router.get('/', async (req, res) => {
  const userEmail = req.user.email;

  if (isDbConnected()) {
    const transactions = await Transaction.find({ userEmail }).sort({ date: -1 }).limit(20);
    return res.json(transactions.map(formatTransaction));
  }

  const transactions = inMemoryTransactions
    .filter((tx) => tx.userEmail === userEmail)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 20);
  res.json(transactions.map(formatTransaction));
});

router.post('/', async (req, res) => {
  const { date, category, amount, type, note } = req.body;
  const userEmail = req.user.email;
  if (!date || !category || typeof amount !== 'number' || !type) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  const transactionPayload = {
    userEmail,
    date,
    category,
    amount,
    type,
    note
  };

  if (isDbConnected()) {
    const transaction = await Transaction.create(transactionPayload);
    return res.status(201).json(formatTransaction(transaction));
  }

  const memoryTransaction = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...transactionPayload
  };

  inMemoryTransactions.push(memoryTransaction);
  res.status(201).json(formatTransaction(memoryTransaction));
});

router.delete('/:id', async (req, res) => {
  const userEmail = req.user.email;
  const { id } = req.params;

  if (isDbConnected()) {
    const tx = await Transaction.findOneAndDelete({ _id: id, userEmail });
    if (!tx) return res.status(404).json({ message: 'Not found' });
    return res.json({ success: true });
  }

  const idx = inMemoryTransactions.findIndex((t) => t.id === id && t.userEmail === userEmail);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  inMemoryTransactions.splice(idx, 1);
  res.json({ success: true });
});

export default router;
