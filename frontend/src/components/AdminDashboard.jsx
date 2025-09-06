import React, { useState, useEffect } from 'react';
import axios from 'axios';
// ✅ Import PieChart components
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { FiUsers, FiBriefcase, FiClock, FiDollarSign } from 'react-icons/fi';
import Sidebar from './Sidebar';
import Header from './Header';

// Helper component for the KPI cards
const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md flex items-center gap-4 transition-transform transform hover:scale-105">
    <div className={`p-3 rounded-full ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{label}</p>
      <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  // We remove useAuth here to avoid showing a specific user's name
  const [stats, setStats] = useState({ employees: 0, departments: 0, leaves: 0, salaryPaid: 0 });
  const [chartData, setChartData] = useState([]);
  const [leaveStatusData, setLeaveStatusData] = useState([]); // ✅ State for the new pie chart
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
   // ✅ The dark mode state is now managed centrally in this layout
 const [isDarkMode,setIsDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  
    // This effect applies the dark mode class to the whole app
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('adminToken');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        const statsRes = await axios.get('/api/dashboard/counts', config);
        if (statsRes.data) {
          setStats(statsRes.data);
        }

        const empRes = await axios.get('/api/employees', config);
        if (Array.isArray(empRes.data)) {
            const deptCounts = empRes.data.reduce((acc, employee) => {
              const dept = employee.department || 'Unassigned';
              acc[dept] = (acc[dept] || 0) + 1;
              return acc;
            }, {});
            setChartData(Object.keys(deptCounts).map(dept => ({ name: dept, employees: deptCounts[dept] })));
        }
        
        
        const leaveRes = await axios.get('/api/leaves', config);
        if (Array.isArray(leaveRes.data)) {
            // ✅ Process data for the new pie chart
            const statusCounts = leaveRes.data.reduce((acc, leave) => {
                acc[leave.status] = (acc[leave.status] || 0) + 1;
                return acc;
            }, {});
            setLeaveStatusData([
                { name: 'Pending', value: statusCounts.Pending || 0 },
                { name: 'Approved', value: statusCounts.Approved || 0 },
                { name: 'Rejected', value: statusCounts.Rejected || 0 },
            ]);
        }
        

      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
        setError('Could not load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    localStorage.setItem("darkMode", isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },[isDarkMode]);
  
  const PIE_CHART_COLORS = {
      Pending: '#f59e0b', // Amber
      Approved: '#16a34a', // Green
      Rejected: '#dc2626', // Red
  };

  if (loading) { /* ... loading JSX from previous step ... */ }
  if (error) { /* ... error JSX from previous step ... */ }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header 
          title={"Admin Dashboard"}
          isDarkMode={isDarkMode} 
          setIsDarkMode={setIsDarkMode} 
        />
        <main className="flex-1 p-6 md:p-8">
          <div className="mb-8">
            {/* ✅ Corrected Welcome Message */}
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
              Welcome back, Admin!
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Here’s a summary of your system’s activity.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard icon={<FiUsers size={22} className="text-blue-600"/>} label="Total Employees" value={stats.employees} color="bg-blue-100" />
            <StatCard icon={<FiBriefcase size={22} className="text-purple-600"/>} label="Departments" value={stats.departments} color="bg-purple-100" />
            <StatCard icon={<FiClock size={22} className="text-yellow-600"/>} label="Total Leaves" value={stats.leaves} color="bg-yellow-100" />
            <StatCard icon={<FiDollarSign size={22} className="text-green-600"/>} label="Total Salary Paid" value={`₹${stats.salaryPaid.toLocaleString()}`} color="bg-green-100" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg mb-4 dark:text-white">Employees by Department</h3>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2}/>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="employees" fill="#3b82f6" />
                    </BarChart>
                </ResponsiveContainer>
              ) : <p className="text-center text-gray-500 dark:text-gray-400">No employee data to display.</p>}
            </div>
            
            {/* ✅ New Pie Chart replacing Recent Leaves */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg mb-4 dark:text-white">Leave Status Overview</h3>
              {leaveStatusData.some(d => d.value > 0) ? (
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={leaveStatusData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                            {leaveStatusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[entry.name]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
              ) : <p className="text-center text-gray-500 dark:text-gray-400">No leave data to display.</p>}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;