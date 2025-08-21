// models/employeeModel.js
import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  name: String,
  employeeId: String,
  gender: String,
  designation: String,
  salary: Number,
  role: String,
  email: String,
  dob: Date,
  maritalStatus: String,
  department: String,
  password: String,
  image: String,
});

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee; // ✅ இது முக்கியம்!
