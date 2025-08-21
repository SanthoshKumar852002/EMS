// routes/departmentRoutes.js
import express from 'express';
import {
  createDepartment,
  getDepartments,
  updateDepartment,
  deleteDepartment,
} from '../controllers/departmentController.js';


const router = express.Router();

// 🔐 Protected Routes
router.post('/',  createDepartment);
router.get('/', getDepartments);
router.put('/:id', updateDepartment);
router.delete('/:id', deleteDepartment);

export default router;
