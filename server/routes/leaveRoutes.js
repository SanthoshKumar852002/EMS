// server/routes/leaveRoutes.js
import express from 'express';
import Leave from '../models/leaveModel.js';

const router = express.Router();

// POST: Apply Leave
router.post('/apply', async (req, res) => {
  try {
    const leave = new Leave(req.body);
    const saved = await leave.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET: Leaves by employeeId
router.get('/employee/:employeeId', async (req, res) => {
  const leaves = await Leave.find({ employeeId: req.params.employeeId }).sort({ appliedDate: -1 });
  res.json(leaves);
});

export default router;
