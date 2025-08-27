// server/routes/salaryRoutes.js
import express from 'express';
import { addSalary, getSalaries, deleteSalary,updateSalary,getEmployeeSalaryHistory } from '../controllers/salaryController.js';
import { protect } from '../middleware/authMiddleware.js'; 
const router = express.Router();

router.post('/', addSalary);       // Add Salary
router.get('/', getSalaries);      // Get all salaries
router.delete('/:id', deleteSalary); // Delete Salary
router.put('/:id',updateSalary);
router.get('/employee/:id', protect, getEmployeeSalaryHistory);
export default router;
