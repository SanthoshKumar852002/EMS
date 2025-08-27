// server/routes/auth.js

import express from 'express';
import { loginUser, registerAdmin ,getUserProfile} from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', loginUser);

// Use the middleware to protect the register-admin route
router.route('/register-admin').post(protect, admin, registerAdmin);
router.get('/profile', protect, getUserProfile);
export default router;