// server/routes/auth.js
import express from "express";
import Employee from "../models/employeeModel.js";

const router = express.Router();

// POST: Employee Login
router.post('/employee/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const employee = await Employee.findOne({ email, password });

    if (!employee) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      _id: employee._id,
      name: employee.name,
      email: employee.email,
      role: employee.role,
      department: employee.department,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
