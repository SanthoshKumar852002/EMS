import Employee from '../models/employeeModel.js';
import fs from 'fs';
import path from 'path';

const deleteImageFile = (filename) => {
  if (!filename) return;
  const imagePath = path.join('uploads', filename);
  fs.unlink(imagePath, (err) => {
    if (err) console.log('❌ Error deleting old image:', err.message);
  });
};

export const addEmployee = async (req, res) => {
  try {
    const image = req.file ? req.file.filename : '';
    const newEmployee = new Employee({ ...req.body, image });
    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });

    deleteImageFile(employee.image); // Delete old image
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const existingEmployee = await Employee.findById(req.params.id);
    if (!existingEmployee) return res.status(404).json({ error: 'Employee not found' });

    let image = existingEmployee.image;
    if (req.file) {
      deleteImageFile(existingEmployee.image); // Delete old image if new one uploaded
      image = req.file.filename;
    }

    const updatedData = { ...req.body, image };
    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    res.json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
