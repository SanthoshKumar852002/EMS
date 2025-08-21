import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Leave from './models/leaveModel.js';
import connectDB from './db/db.js';

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await Leave.deleteMany();

    const sampleLeaves = [
      {
        employeeId: 'EMP001',
        leaveType: 'Sick Leave',
        fromDate: new Date('2025-08-01'),
        toDate: new Date('2025-08-03'),
        description: 'Fever and rest needed',
        status: 'Pending',
        appliedDate: new Date()
      },
      {
        employeeId: 'EMP002',
        leaveType: 'Casual Leave',
        fromDate: new Date('2025-08-05'),
        toDate: new Date('2025-08-07'),
        description: 'Family trip',
        status: 'Approved',
        appliedDate: new Date()
      }
    ];

    await Leave.insertMany(sampleLeaves);
    console.log('✅ Leave Data Seeded Successfully');
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

importData();
