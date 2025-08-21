// server/routes/salaryRoutes.js
import express from 'express';
import { addSalary, getSalaries, deleteSalary,updateSalary } from '../controllers/salaryController.js';

const router = express.Router();

router.post('/', addSalary);       // Add Salary
router.get('/', getSalaries);      // Get all salaries
router.delete('/:id', deleteSalary); // Delete Salary
router.put('/:id',updateSalary);
export default router;
