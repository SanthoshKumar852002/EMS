import Employee from '../models/employeeModel.js';
import User from '../models/userModel.js'; // For admin login
import jwt from 'jsonwebtoken';

// Function to generate a JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

export const loginUser = async (req, res) => {
  const { employeeId, email, password } = req.body;

  try {
    // --- ADMIN LOGIN LOGIC ---
    // If an email is provided, it's an admin login attempt
    if (email) {
      const admin = await User.findOne({ email });
      // Check if admin exists and password is correct (hashed)
      if (admin && (await admin.matchPassword(password))) {
        return res.json({
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          token: generateToken(admin._id),
        });
      } else {
        return res.status(401).json({ message: 'Invalid admin credentials' });
      }
    }

    // --- NEW EMPLOYEE LOGIN LOGIC ---
    // If an employeeId is provided, it's an employee login attempt
    if (employeeId) {
      // The new rule: The password must be the same as the employeeId
      if (employeeId !== password) {
        return res.status(401).json({ message: 'For employees, the Employee ID and Password must be the same.' });
      }

      // Find the employee in the 'employees' collection
      const employee = await Employee.findOne({ employeeId });

      if (employee) {
        // If found, login is successful
        return res.json({
          _id: employee._id,
          name: employee.name,
          employeeId: employee.employeeId,
          email: employee.email,
          role: employee.role,
          token: generateToken(employee._id),
        });
      } else {
        return res.status(401).json({ message: 'An employee with this ID was not found.' });
      }
    }

    // If the request is missing both email and employeeId
    return res.status(400).json({ message: 'Missing login credentials. Please provide an email or an Employee ID.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
};
export const getUserProfile = async (req, res) => {
  try {
    // The 'protect' middleware finds the user ID from the token and puts it on `req.user`
    // We check both collections to find the matching profile
    let userProfile = await User.findById(req.user._id).select('-password');
    if (!userProfile) {
      userProfile = await Employee.findById(req.user._id).select('-password');
    }

    if (userProfile) {
      res.json({
        _id: userProfile._id,
        name: userProfile.name,
        email: userProfile.email,
        employeeId: userProfile.employeeId,
        role: userProfile.role,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
// This function for registering new admins remains the same
export const registerAdmin = async (req, res) => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'Admin with this email already exists' });
    }
    const user = await User.create({ name, email, password, role: 'admin' });
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};