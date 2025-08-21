import React from 'react';
import { useAuth } from '../context/AuthContext';
import Header from './Header';
import OverviewCards from './Overviewcards'; // ✅ Capitalized
import LeaveSummary from './LeaveSummary';
import Sidebar from './Sidebar';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 bg-white text-black p-4">
        <Header
          title="💼 Employee Management System"
          subtitle={`👋 Welcome, ${user?.name || 'Admin'}`}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4 animate-fade-in">
          <OverviewCards />
        </div>

        <div className="mt-6">
          <center>
            <h2 className="text-2xl font-semibold mb-4">📝 Leave Details</h2>
          </center>
          <LeaveSummary />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
  