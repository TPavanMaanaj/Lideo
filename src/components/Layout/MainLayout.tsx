import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Header from './Header';
import Sidebar from './Sidebar';
import SuperAdminDashboard from '../Dashboard/SuperAdminDashboard';
import UniversityAdminDashboard from '../Dashboard/UniversityAdminDashboard';
import StudentDashboard from '../Dashboard/StudentDashboard';

const MainLayout: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const getDashboardTitle = () => {
    switch (user?.role) {
      case 'super_admin':
        return 'Super Admin Dashboard';
      case 'university_admin':
        return 'University Admin Dashboard';
      case 'student':
        return 'Student Dashboard';
      default:
        return 'Dashboard';
    }
  };

  const renderDashboard = () => {
    switch (user?.role) {
      case 'super_admin':
        return <SuperAdminDashboard activeTab={activeTab} />;
      case 'university_admin':
        return <UniversityAdminDashboard activeTab={activeTab} />;
      case 'student':
        return <StudentDashboard activeTab={activeTab} />;
      default:
        return <div>Access Denied</div>;
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title={getDashboardTitle()} />
        <main className="flex-1 overflow-auto bg-gray-50">
          {renderDashboard()}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;