import mongoose from 'mongoose';

const leaveSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
  },
  leaveType: {
    type: String,
    required: true,
  },
  fromDate: {
    type: String,
    required: true,
  },
  toDate: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  appliedDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
});

const Leave = mongoose.model('Leave', leaveSchema);
export default Leave;
