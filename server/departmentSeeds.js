// departmentSeed.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Department from './models/departmentModel.js';

dotenv.config();

const sampleDepartments = [
  { name: 'Development', description: 'Software team' },
  { name: 'HR', description: 'Human resources' },
  { name: 'Design', description: 'Creative and UI team' },
];

const seedDepartments = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Department.deleteMany(); // Optional: clean before insert
    await Department.insertMany(sampleDepartments);
    console.log('✅ Sample departments inserted!');
    process.exit();
  } catch (err) {
    console.error('❌ Error inserting sample departments:', err);
    process.exit(1);
  }
};

seedDepartments();
