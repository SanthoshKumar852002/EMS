// employeeSeeds.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Employee from './models/employeeModel.js'; // ✅ default export

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    return Employee.insertMany([
      {
        name: 'Santhosh',
        employeeId: 'EMP001',
        gender: 'Male',
        designation: 'Developer',
        salary: 40000,
        role: 'employee',
        email: 'santhosh@gmail.com',
        dob: '2000-01-01',
        maritalStatus: 'Single',
        department: 'Software',
        password: '123456', // 🔐 plain password only if you don't use hashing
        image: 'https://via.placeholder.com/150',
      },
      {
        name: 'Priya',
        employeeId: 'EMP002',
        gender: 'Female',
        designation: 'HR',
        salary: 35000,
        role: 'employee',
        email: 'priya@gmail.com',
        dob: '1998-08-15',
        maritalStatus: 'Married',
        department: 'HR',
        password: '123456',
        image: 'https://via.placeholder.com/150',
      }
    ]);
  })
  .then(() => {
    console.log('Employee data seeded successfully');
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error('Seeding error:', err);
  });
