import React, { useState } from 'react';
import { 
  BookOpen, 
  Calendar, 
  Award, 
  FileText, 
  Video, 
  Link, 
  Download,
  Plus,
  Search,
  Clock,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import * as CourseService from '../../services/Courseservice';
import * as StudentService from '../../services/Studentservice';
import * as UniversityService from '../../services/Universityservice';

interface StudentDashboardProps {
  activeTab: string;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ activeTab }) => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<'overview' | 'courses' | 'registration' | 'grades'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  // Data states
  const [courses, setCourses] = useState<CourseService.Course[]>([]);
  const [students, setStudents] = useState<StudentService.Student[]>([]);
  const [universities, setUniversities] = useState<UniversityService.University[]>([]);

  // Update activeView based on sidebar selection
  React.useEffect(() => {
    switch (activeTab) {
      case 'dashboard':
        setActiveView('overview');
        break;
      case 'courses':
        setActiveView('courses');
        break;
      case 'registration':
        setActiveView('registration');
        break;
      case 'grades':
        setActiveView('grades');
        break;
      case 'settings':
        // We'll handle settings separately
        break;
      default:
        setActiveView('overview');
    }
  }, [activeTab]);

  // Load data on component mount and when activeView changes
  React.useEffect(() => {
    loadAllData();
  }, [activeView]);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadCourses(),
        loadStudents(),
        loadUniversities()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCourses = async () => {
    try {
      const response = await CourseService.getAllCourses();
      setCourses(response.data);
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  };

  const loadStudents = async () => {
    try {
      const response = await StudentService.getAllStudents();
      setStudents(response.data);
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  const loadUniversities = async () => {
    try {
      const response = await UniversityService.getAllUniversities();
      setUniversities(response.data);
    } catch (error) {
      console.error('Error loading universities:', error);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
  };

  // Find current student data
  const currentStudent = students.find(s => s.email === user?.email);
  const currentUniversityId = user?.universityId ? parseInt(user.universityId) : 0;
  const enrolledCourses = courses.filter(course => 
    course.universityId === currentUniversityId
  ).slice(0, 3); // Simplified - showing first 3 courses as "enrolled"
  const availableCourses = courses.filter(course => 
    course.universityId === currentUniversityId
  );
  const currentUniversity = universities.find(u => u.id === currentUniversityId);

  const stats = [
    {
      title: 'Enrolled Courses',
      value: enrolledCourses.length,
      icon: BookOpen,
      color: 'bg-blue-500'
    },
    {
      title: 'Credits Earned',
      value: enrolledCourses.reduce((sum, course) => sum + (course.credits || 0), 0),
      icon: Award,
      color: 'bg-green-500'
    },
    {
      title: 'Average Grade',
      value: 'A-',
      icon: FileText,
      color: 'bg-purple-500'
    },
    {
      title: 'Current Year',
      value: currentStudent?.year || '1',
      icon: Calendar,
      color: 'bg-orange-500'
    }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Student Overview</h2>
        <button
          onClick={refreshData}
          disabled={refreshing}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome back, {currentStudent?.fullName || user?.name}!</h2>
        <p className="text-indigo-100">
          {currentStudent?.major} • Year {currentStudent?.year} • {currentStudent?.studentId}
          <br />
          {currentUniversity?.uniName}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Courses</h3>
          <div className="space-y-3">
            {enrolledCourses.slice(0, 3).map((course) => (
              <div key={course.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{course.courseName}</p>
                  <p className="text-sm text-gray-600">{course.instructor} • {course.credits} credits</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    In Progress
                  </p>
                  <p className="text-xs text-gray-500">Active</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Deadlines</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">CS101 Assignment</p>
                <p className="text-sm text-gray-600">Due in 2 days</p>
              </div>
              <div className="text-red-600">
                <Clock size={20} />
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">MATH301 Quiz</p>
                <p className="text-sm text-gray-600">Due in 5 days</p>
              </div>
              <div className="text-yellow-600">
                <Clock size={20} />
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">CS229 Project</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
              <div className="text-green-600">
                <CheckCircle size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">My Courses</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {enrolledCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{course.courseName}</h3>
                <p className="text-sm text-gray-600">{course.instructor}</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                In Progress
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">{course.description}</p>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Credits:</span>
                <span className="font-medium">{course.credits}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium">{course.status}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Instructor:</span>
                <span className="font-medium">{course.instructor}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Course Information</h4>
              <div className="text-sm text-gray-600">
                University: {universities.find(u => u.id === course.universityId)?.uniName || 'Unknown'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRegistration = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Course Registration</h2>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search available courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {availableCourses.map((course) => (
              <div key={course.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{course.courseName}</h3>
                    <p className="text-sm text-gray-600">{course.instructor}</p>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {course.credits} credits
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">{course.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium">{course.status}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Instructor:</span>
                    <span className="font-medium">{course.instructor}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Credits:</span>
                    <span className="font-medium">{course.credits}</span>
                  </div>
                </div>

                <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2">
                  <Plus size={16} />
                  <span>Register for Course</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Registration Confirmation Modal */}
      {showRegistrationModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Course Registration</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to register for this course? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowRegistrationModal(false);
                  setSelectedCourse(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle registration logic here
                  setShowRegistrationModal(false);
                  setSelectedCourse(null);
                }}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Confirm Registration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderGrades = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Academic Progress</h2>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">3.7</div>
              <div className="text-sm text-gray-600">Current GPA</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{enrolledCourses.reduce((sum, course) => sum + (course.credits || 0), 0)}</div>
              <div className="text-sm text-gray-600">Total Credits</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{enrolledCourses.length}</div>
              <div className="text-sm text-gray-600">Completed Courses</div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Instructor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {enrolledCourses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{course.courseName}</div>
                      <div className="text-sm text-gray-500">{course.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{course.instructor}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{course.credits}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                      In Progress
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      Enrolled
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={currentStudent?.fullName || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={currentStudent?.email || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
              <input
                type="text"
                value={currentStudent?.studentId || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Major</label>
              <input
                type="text"
                value={currentStudent?.major || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
              <input
                type="text"
                value={currentUniversity?.uniName || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                readOnly
              />
            </div>
            <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
              Update Profile
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <button className="w-full text-left px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Change Password
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notifications</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" defaultChecked />
                  <span className="ml-2 text-sm text-gray-700">Email notifications</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" defaultChecked />
                  <span className="ml-2 text-sm text-gray-700">Course updates</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                  <span className="ml-2 text-sm text-gray-700">Grade notifications</span>
                </label>
              </div>
            </div>
            <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
              Update Settings
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-indigo-600">{currentStudent?.year}</div>
            <div className="text-sm text-gray-600">Current Year</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">3.7</div>
            <div className="text-sm text-gray-600">GPA</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{enrolledCourses.reduce((sum, course) => sum + course.credits, 0)}</div>
            <div className="text-sm text-gray-600">Total Credits</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (isLoading && (courses.length === 0 && students.length === 0)) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading data...</p>
          </div>
        </div>
      );
    }

    // Handle settings from sidebar
    if (activeTab === 'settings') {
      return renderSettings();
    }
    
    switch (activeView) {
      case 'overview':
        return renderOverview();
      case 'courses':
        return renderCourses();
      case 'registration':
        return renderRegistration();
      case 'grades':
        return renderGrades();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {activeTab !== 'settings' && (
        <div className="flex-shrink-0 px-6 pt-6 pb-4 bg-white border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'courses', label: 'My Courses' },
              { id: 'registration', label: 'Registration' },
              { id: 'grades', label: 'Grades' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeView === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      )}

      <div className="flex-1 overflow-auto p-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default StudentDashboard;