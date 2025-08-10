import React from 'react';
import { 
  Home, 
  Users, 
  BookOpen, 
  GraduationCap, 
  Building, 
  BarChart3, 
  Settings,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  activeTab: string;  
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { user } = useAuth();

  const getMenuItems = () => {
    switch (user?.role) {
      case 'SUPER_ADMIN':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'universities', label: 'Universities', icon: Building },
          { id: 'admins', label: 'Admins', icon: UserCheck },
          { id: 'students', label: 'Students', icon: Users },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'settings', label: 'Settings', icon: Settings }
        ];
      case 'UNIVERSITY_ADMIN':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'courses', label: 'Courses', icon: BookOpen },
          { id: 'students', label: 'Students', icon: Users },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'settings', label: 'Settings', icon: Settings }
        ];
      case 'STUDENT':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'courses', label: 'My Courses', icon: BookOpen },
          { id: 'registration', label: 'Course Registration', icon: GraduationCap },
          { id: 'grades', label: 'Grades', icon: BarChart3 },
          { id: 'settings', label: 'Settings', icon: Settings }
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="w-64 bg-gray-900 text-white h-screen flex flex-col flex-shrink-0">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-xl font-bold  font-family: var(--font-)">Lideo</h2>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
      
    </div>
  );
};

export default Sidebar;