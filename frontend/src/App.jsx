import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import Protected Route Components
import AdminProtectedRoute from "./components/AdminProtectedRoute.jsx";
import EmployeeProtectedRoute from "./components/EmployeeProtectedRoute.jsx";

// Import Page and Component Files
import AuthSelection from './pages/AuthSelection.jsx';
import AdminDashboard from "./components/AdminDashboard.jsx";
import EmployeeDashboard from "./pages/EmployeeDashboard.jsx";
import Profile from './pages/Profile.jsx';
import EditProfile from './pages/EditProfile.jsx';
import ApplyLeave from './pages/ApplyLeave.jsx';
import SalaryHistory from './pages/SalaryHistory.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import EmployeeLogin from './pages/EmployeeLogin.jsx';
// ... import your other admin pages (ManageEmployees, SalaryDashboard, etc.)
import ManageEmployees from "./pages/ManageEmployees.jsx";
import SalaryDashboard from "./pages/SalaryDashboard.jsx";
import LeavesDashboard from "./pages/LeavesDashboard.jsx";
import DepartmentsDashboard from "./pages/DepartmentsDashboard.jsx";
import AddEmployee from "./pages/AddEmployee.jsx";
import Settings from "./pages/Settings.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* === Public Routes === */}
        <Route path="/" element={<AuthSelection />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/employee-login" element={<EmployeeLogin />} />
      
        {/* === Admin Protected Routes === */}
        <Route path="/admin-dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
        <Route path="/admin/employees" element={<AdminProtectedRoute><ManageEmployees /></AdminProtectedRoute>} />
        <Route path="/admin/add-employee" element={<AdminProtectedRoute><AddEmployee /></AdminProtectedRoute>} />
        <Route path="/admin/salary" element={<AdminProtectedRoute><SalaryDashboard /></AdminProtectedRoute>} />
        <Route path="/admin/leaves" element={<AdminProtectedRoute><LeavesDashboard /></AdminProtectedRoute>} />
        <Route path="/admin/departments" element={<AdminProtectedRoute><DepartmentsDashboard /></AdminProtectedRoute>} />
        <Route path="/admin/settings" element={<AdminProtectedRoute><Settings /></AdminProtectedRoute>} />  
        {/* === Employee Protected Routes (Now Nested) === */}
        <Route 
          path="/employee-dashboard" 
          element={<EmployeeProtectedRoute><EmployeeDashboard /></EmployeeProtectedRoute>}
        >
          {/* The Profile page is the default child route */}
          <Route index element={<Profile />} /> 
          <Route path="profile" element={<Profile />} />
          <Route path="edit-profile" element={<EditProfile />} />
          <Route path="apply-leave" element={<ApplyLeave />} />
          <Route path="salary-history" element={<SalaryHistory />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;