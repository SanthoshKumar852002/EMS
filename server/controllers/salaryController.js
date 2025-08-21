// server/controllers/salaryController.js
import Salary from '../models/salaryModel.js';

export const addSalary = async (req, res) => {
  try {
    const { employeeId, salary, allowance, deduction } = req.body;
    const total = salary + allowance - deduction;

    const newSalary = new Salary({ employeeId, salary, allowance, deduction, total });
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

export const deleteSalary = async (req, res) => {
  try {
    await Salary.findByIdAndDelete(req.params.id);
    res.json({ message: 'Salary record deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Update salary
export const updateSalary = async (req, res) => {
  try {
    const { salary, allowance, deduction } = req.body;
    const total = salary + allowance - deduction;

    const updated = await Salary.findByIdAndUpdate(
      req.params.id,
      { ...req.body, total },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
