// server/models/employeeModel.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; // Import bcrypt

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
   email: { type: String, required: true, unique: true },

 
  employeeId: { type: String, required: true, unique: true },
  role: { type: String, default: 'employee' },
  department: String,
  designation: String,
  salary: Number,
  dob: Date,
  gender: String,
  image: String, 
}, { timestamps: true });
employeeSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
employeeSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
// ✅ HASHS THE PASSWORD BEFORE SAVING

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;