import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db/db.js';

import departmentRoutes from './routes/departmentRoutes.js';
import authRoutes from './routes/auth.js';
import employeeRoutes from './routes/employeeRoutes.js';
import salaryRoutes from './routes/salaryRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js'; 




dotenv.config();
const app = express();

// ✅ Allow multiple frontend origins (e.g., 5173 and 5176)
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5176'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('❌ Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());

// ✅ Connect to MongoDB
connectDB();

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/salaries', salaryRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ✅ Root Route
app.get('/', (req, res) => {
  res.send('✅ Server running...');
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
