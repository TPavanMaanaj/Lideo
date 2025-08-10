
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Header from './Header';
import Sidebar from './Sidebar';
import SuperAdminDashboard from '../Dashboard/SuperAdminDashboard';
import UniversityAdminDashboard from '../Dashboard/UniversityAdminDashboard';
import StudentDashboard from '../Dashboard/StudentDashboard';

const MainLayout: React.FC = () => {
  const { user } = useAuth();
const [activeTab, setActiveTab] = useState<string>('dashboard');

  const getDashboardTitle = () => {
    switch (user?.role) {
      case 'SUPER_ADMIN':
        return 'Super Admin Dashboard';
      case 'UNIVERSITY_ADMIN':
        return 'University Admin Dashboard';
      case 'STUDENT':
        return 'Student Dashboard';
      default:
        return 'Dashboard';
    }
  };

  const renderDashboard = () => {
    switch (user?.role) {
      case 'SUPER_ADMIN':
        return <SuperAdminDashboard activeTab={activeTab} universityId={0} />;
      case 'UNIVERSITY_ADMIN':
        return <UniversityAdminDashboard activeTab={activeTab} universityId={user.universityId}/>;
      case 'STUDENT':
        return <StudentDashboard activeTab={activeTab} universityId={user.universityId}/>;
      default:
        return <div>Access Denied</div>;
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Fixed Sidebar with proper styling */}
      <div className="w-64 h-full bg-white border-r">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      
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