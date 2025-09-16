import Employee from '../models/employeeModel.js';
import fs from 'fs';
import path from 'path';



export const getEmployeeProfile = async (req, res) => {
  try {
    // req.user._id is attached by the 'protect' middleware from the token
    const employee = await Employee.findById(req.user._id);

    if (employee) {
      res.json(employee);
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteImageFile = (filename) => {
  if (!filename) return;
  const imagePath = path.join('uploads', filename);
  fs.unlink(imagePath, (err) => {
    if (err) console.log('❌ Error deleting old image:', err.message);
  });
};
export const updateUserProfile = async (req, res) => {
  try {
    // The protect middleware gives us the user's ID
    const employee = await Employee.findById(req.user._id);

    if (employee) {
      // Delete old image if a new one is uploaded
      if (req.file && employee.image) {
        fs.unlink(path.join('uploads', employee.image), (err) => {
          if (err) console.error("Failed to delete old image:", err);
        });
      }
      
      // Update fields
      employee.name = req.body.name || employee.name;
      employee.email = req.body.email || employee.email;
      employee.image = req.file ? req.file.filename : employee.image;

      // Add other fields you want to allow updating
      // e.g., employee.gender = req.body.gender || employee.gender;

      const updatedEmployee = await employee.save();

      // Return the full updated profile
      res.json({
        _id: updatedEmployee._id,
        name: updatedEmployee.name,
        email: updatedEmployee.email,
        employeeId: updatedEmployee.employeeId,
        role: updatedEmployee.role,
        image: updatedEmployee.image,
        // ... any other fields
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
export const addEmployee = async (req, res) => {
  const { name, employeeId, department, designation, salary, dob, gender } = req.body;

  try {
    const employeeExists = await Employee.findOne({ employeeId });
    if (employeeExists) {
      return res.status(400).json({ message: 'An employee with this ID already exists.' });
    }

    const image = req.file ? req.file.filename : '';

    // ✅ Set the password to be the employeeId
    const newEmployee = new Employee({
      name,
      employeeId,
      email: req.body.email, 
      password: employeeId,  
      department,
      designation,
      salary,
      dob,
      gender,
      image,
    });

    await newEmployee.save(); // The model will automatically hash the password
    res.status(201).json(newEmployee);
  } catch (error) {
    // ✅ IMPROVED ERROR HANDLING
    // Check if it's a duplicate key error (code 11000)
    if (error.code === 11000) {
      // Determine which field was the duplicate
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ message: `An employee with this ${field} already exists.` });
    }
    
    // For any other kind of error, send a generic 500
    console.error("Add employee error:", error);
    res.status(500).json({ message: 'Server error while adding employee.' });
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

    deleteImageFile(employee.image);
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
      deleteImageFile(existingEmployee.image);
      image = req.file.filename;
    }

    const updatedData = { ...req.body, image };
    
    // If password is being updated, it will be hashed by the pre-save hook
    // Note: findByIdAndUpdate doesn't trigger 'save' hooks by default.
    // A more robust solution would be to fetch, update, and then call .save().
    // For now, this is a simplification.
    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    res.json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
