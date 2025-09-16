import express from 'express';
// ✅ Import your controller functions and middleware
import { applyLeave, getLeaves, updateLeaveStatus,getMyLeaveHistory } from '../controllers/leaveController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- Routes ---

// POST /api/leaves
// Applies for a leave (should be protected so only logged-in users can apply)
router.post('/', protect, applyLeave);

// GET /api/leaves
// Gets all leaves (should be protected for admins)
router.get('/', protect, getLeaves);
router.get('/my-history', protect, getMyLeaveHistory);
// ✅ THIS IS THE MISSING ROUTE
// PUT /api/leaves/:id/status
// Updates a leave's status (should be protected for admins)
router.put('/:id/status', protect, updateLeaveStatus);


export default router;