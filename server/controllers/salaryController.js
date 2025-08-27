// server/controllers/salaryController.js
import Salary from '../models/salaryModel.js';

export const addSalary = async (req, res) => {
  try {
    const { employeeId, salary, allowance, deduction, payDate } = req.body;

    // ✅ CONVERT STRINGS TO NUMBERS before calculation
    const numSalary = parseInt(salary, 10) || 0;
    const numAllowance = parseInt(allowance, 10) || 0;
    const numDeduction = parseInt(deduction, 10) || 0;
    const total = numSalary + numAllowance - numDeduction;

    const newSalary = new Salary({ 
      employeeId, 
      salary: numSalary, 
      allowance: numAllowance, 
      deduction: numDeduction, 
      total, // Save the correctly calculated total
      payDate 
    });

    await newSalary.save();
    res.status(201).json(newSalary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSalaries = async (req, res) => {
  try {
    const salaries = await Salary.find().populate('employeeId', 'name employeeId');
    res.json(salaries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getEmployeeSalaryHistory = async (req, res) => {
  try {
    const salaries = await Salary.find({ employeeId: req.params.id })
      .sort({ payDate: -1 });

    if (!salaries) {
      return res.status(404).json({ message: 'No salary history found for this employee.' });
    }
    
    res.json(salaries);
  } catch (error) {
    console.error('Error fetching employee salary history:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteSalary = async (req, res) => {
  try {
    await Salary.findByIdAndDelete(req.params.id);
    res.json({ message: 'Salary record deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateSalary = async (req, res) => {
  try {
    const { salary, allowance, deduction } = req.body;

    // ✅ CONVERT STRINGS TO NUMBERS here as well
    const numSalary = parseInt(salary, 10) || 0;
    const numAllowance = parseInt(allowance, 10) || 0;
    const numDeduction = parseInt(deduction, 10) || 0;
    const total = numSalary + numAllowance - numDeduction;

    const updated = await Salary.findByIdAndUpdate(
      req.params.id,
      { ...req.body, total }, // Save the correct total
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};