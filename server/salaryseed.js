// C:/EMS/server/salarySeed.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './db/db.js';
import Salary from './models/salaryModel.js';
import Employee from './models/employeeModel.js';

dotenv.config();
await connectDB();

const insertSalaries = async () => {
  try {
    const employees = await Employee.find();

    const salaries = [
      { employeeId: employees[0]._id, salary: 30000, allowance: 2000, deduction: 1000 },
      { employeeId: employees[1]._id, salary: 25000, allowance: 1500, deduction: 500 },
      { employeeId: employees[2]._id, salary: 22000, allowance: 1200, deduction: 800 },
      { employeeId: employees[3]._id, salary: 28000, allowance: 1800, deduction: 600 },
    ].map(item => ({
      ...item,
      total: item.salary + item.allowance - item.deduction,
      payDate: new Date()
    }));

    await Salary.insertMany(salaries);
    console.log('✅ Sample salary data inserted!');
    process.exit();
  } catch (err) {
    console.error('❌ Error inserting salary data:', err.message);
    process.exit(1);
  }
};

insertSalaries();
