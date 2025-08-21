// server/models/salaryModel.js
import mongoose from 'mongoose';

const salarySchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  salary: Number,
  allowance: Number,
  deduction: Number,
  total: Number,
  payDate: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Salary', salarySchema);
