import express from 'express';
import Leave from '../models/leaveModel.js';

const router = express.Router();

// POST: Apply Leave
// Corrected Path: Changed from '/apply' to '/' to match the frontend API call
router.post('/', async (req, res) => {
  try {
    const leave = new Leave(req.body);
    const saved = await leave.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET: All leaves (can be filtered by search query)
// Corrected Path: Changed from '/employee/:employeeId' to '/' to match fetchLeaves function
router.get('/', async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};
        if (search) {
            query = { employeeId: { $regex: search, $options: 'i' } };
        }
        const leaves = await Leave.find(query).sort({ appliedDate: -1 });
        res.json(leaves);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;