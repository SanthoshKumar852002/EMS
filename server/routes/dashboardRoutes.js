import express from 'express';
import Employee from '../models/employeeModel.js';
import Department from '../models/departmentModel.js';
import Leave from '../models/leaveModel.js';
import Salary from '../models/salaryModel.js';

const router = express.Router();

// GET: All counts for the main dashboard
router.get('/counts', async (req, res) => {
  try {
    // Get the total number of documents in each collection
    const employeeCount = await Employee.countDocuments();
    const departmentCount = await Department.countDocuments();
    const leaveCount = await Leave.countDocuments();

    // Calculate the total salary paid.
    // This assumes you have a Salary model and want to sum up a 'totalSalary' field.
    const salaryResult = await Salary.aggregate([
      {
        $group: {
          _id: null, // Group all documents into one
          totalPaid: { $sum: '$total' }, // Sum the 'totalSalary' field
        },
      },
    ]);
    
    // Extract the total salary, defaulting to 0 if no salaries are found
    const totalSalaryPaid = salaryResult.length > 0 ? salaryResult[0].totalPaid : 0;

    // Send all counts back in a single JSON object
    res.json({
      employees: employeeCount,
      departments: departmentCount,
      leaves: leaveCount,
      salaryPaid: totalSalaryPaid,
    });

  } catch (err) {
    console.error('Error fetching dashboard counts:', err);
    res.status(500).json({ message: 'Server error while fetching dashboard counts.' });
  }
});

export default router;