// src/utils/roleBasedRoute.js
import { Navigate, Outlet } from 'react-router-dom';

const RoleBasedRoute = ({ user, allowedRoles }) => {
  if (!user) return <Navigate to="/login" />;
  return allowedRoles.includes(user.role) ? <Outlet /> : <Navigate to="/unauthorized" />;
};

export default RoleBasedRoute;
