import express from 'express';
import multer from 'multer';
import {
  addEmployee,
  getEmployees,
  deleteEmployee,
  updateEmployee
} from '../controllers/employeeController.js';

const router = express.Router();

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Make sure 'uploads/' folder exists
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

router.post('/', upload.single('image'), addEmployee);
router.get('/', getEmployees);
router.put('/:id', upload.single('image'), updateEmployee);
router.delete('/:id', deleteEmployee);

export default router;
