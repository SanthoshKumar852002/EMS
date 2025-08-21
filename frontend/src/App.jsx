import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import SalaryDashboard from "./pages/SalaryDashboard.jsx";
import LeavesDashboard from "./pages/LeavesDashboard.jsx";
import DepartmentsDashboard from "./pages/DepartmentsDashboard.jsx";
import EmployeeDashboard from "./pages/EmployeeDashboard.jsx";
import ManageEmployees from "./pages/ManageEmployees.jsx";
import AddEmployee from "./pages/AddEmployee.jsx";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin-dashboard" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
        <Route path="/admin/employees" element={<ManageEmployees />} />
        <Route path="/admin/add-employee" element={<AddEmployee />} />
        <Route path="/admin/salary" element={<SalaryDashboard />} />
        <Route path="/admin/leaves" element={<LeavesDashboard />} />
        <Route path="/admin/departments" element={<DepartmentsDashboard />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
