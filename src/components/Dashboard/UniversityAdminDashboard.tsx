import React, { useState } from 'react';
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  X,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import * as CourseService from '../../services/Courseservice';
import * as StudentService from '../../services/Studentservice';
import * as UniversityService from '../../services/Universityservice';

interface UniversityAdminDashboardProps {
  activeTab: string;
}

const UniversityAdminDashboard: React.FC<UniversityAdminDashboardProps> = ({ activeTab }) => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<'overview' | 'courses' | 'students'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);

  // Data states
  const [courses, setCourses] = useState<CourseService.Course[]>([]);
  const [students, setStudents] = useState<StudentService.Student[]>([]);
  const [universities, setUniversities] = useState<UniversityService.University[]>([]);

  // Form states
  const [courseForm, setCourseForm] = useState({
    courseName: '',
    description: '',
    credits: 3,
    instructor: '',
    universityId: 0,
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE'
  });

  const [studentForm, setStudentForm] = useState({
    studentId: '',
    fullName: '',
    email: '',
    major: '',
    year: '1',
    phoneNumber: '',
    universityId: 0
  });

  // Update activeView based on sidebar selection
  React.useEffect(() => {
    switch (activeTab) {
      case 'dashboard':
        setActiveView('overview');
        break;
      case 'courses':
        setActiveView('courses');
        break;
      case 'students':
        setActiveView('students');
        break;
      default:
        setActiveView('overview');
    }
  }, [activeTab]);

  // Load data on component mount and when activeView changes
  React.useEffect(() => {
    loadData();
    
    // Set up polling for real-time updates every 30 seconds
    const interval = setInterval(() => {
      if (!isLoading) {
        loadData();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [activeView]);

  const loadData = async () => {
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
      console.log('Loaded courses:', response.data);
      setCourses(response.data);
    } catch (error) {
      console.error('Error loading courses:', error);
      alert('Failed to load courses. Please check your connection.');
    }
  };

  const loadStudents = async () => {
    try {
      const response = await StudentService.getAllStudents();
      console.log('Loaded students:', response.data);
      setStudents(response.data);
    } catch (error) {
      console.error('Error loading students:', error);
      alert('Failed to load students. Please check your connection.');
    }
  };

  const loadUniversities = async () => {
    try {
      const response = await UniversityService.getAllUniversities();
      console.log('Loaded universities:', response.data);
      setUniversities(response.data);
    } catch (error) {
      console.error('Error loading universities:', error);
      alert('Failed to load universities. Please check your connection.');
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Filter data for current university (assuming user has universityId)
  const currentUniversityId = user?.universityId ? parseInt(user.universityId) : 0;
  const universityCourses = courses.filter(course => course.universityId === currentUniversityId);
  const universityStudents = students.filter(student => student.universityId === currentUniversityId);
  const currentUniversity = universities.find(u => u.id === currentUniversityId);

  const stats = [
    {
      title: 'Total Courses',
      value: universityCourses.length,
      icon: BookOpen,
      color: 'bg-blue-500',
      trend: '+5%'
    },
    {
      title: 'Total Students',
      value: universityStudents.length,
      icon: Users,
      color: 'bg-green-500',
      trend: '+12%'
    },
    {
      title: 'Active Enrollments',
      value: universityStudents.length * 2, // Simplified calculation
      icon: TrendingUp,
      color: 'bg-purple-500',
      trend: '+18%'
    }
  ];

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const courseData = {
        ...courseForm,
        universityId: currentUniversityId
      };
      
      console.log('Creating course:', courseData);
      const response = await CourseService.createCourse(courseData);
      console.log('Course created:', response.data);
      
      // Reload data to reflect changes
      await loadCourses();
      
      // Close modal and reset form
      setShowAddCourseModal(false);
      resetCourseForm();
      
      alert('Course added successfully!');
    } catch (error) {
      console.error('Error adding course:', error);
      alert('Failed to add course. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const studentData = {
        ...studentForm,
        universityId: currentUniversityId
      };
      
      await loadStudents();
      setShowAddStudentModal(false);
      resetStudentForm();
    } catch (error) {
      console.error('Error adding student:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCourse = async (id: number) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    
    setIsLoading(true);
    try {
      await CourseService.deleteCourse(id);
      await loadCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStudent = async (id: number) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    
    setIsLoading(true);
    try {
      await StudentService.deleteStudent(id);
      await loadStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetCourseForm = () => {
    setCourseForm({
      courseName: '',
      description: '',
      credits: 3,
      instructor: '',
      universityId: 0,
      status: 'ACTIVE'
    });
  };

  const resetStudentForm = () => {
    setStudentForm({
      studentId: '',
      fullName: '',
      email: '',
      major: '',
      year: '1',
      phoneNumber: '',
      universityId: 0
    });
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">University Overview</h2>
        <button
          onClick={refreshData}
          disabled={refreshing}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.trend} from last month</p>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Performance</h3>
          <div className="space-y-3">
            {universityCourses.slice(0, 3).map((course) => (
              <div key={course.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{course.courseName}</p>
                  <p className="text-sm text-gray-600">{course.instructor} • {course.credits} credits</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  course.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {course.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Students</h3>
          <div className="space-y-3">
            {universityStudents.slice(0, 3).map((student) => (
              <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{student.fullName}</p>
                  <p className="text-sm text-gray-600">{student.major} - Year {student.year}</p>
                </div>
                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                  {student.studentId}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Course Management</h2>
        <button 
          onClick={() => setShowAddCourseModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Course</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
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
                  Enrollment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {universityCourses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{course.courseName}</div>
                      <div className="text-sm text-gray-500">{course.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{course.instructor}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">-/-</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{course.credits}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      course.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {course.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-900">
                        <Eye size={16} />
                      </button>
                      <button className="text-blue-600 hover:text-blue-900">
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteCourse(course.id!)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Course Modal */}
      {showAddCourseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Course</h3>
              <button
                onClick={() => setShowAddCourseModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddCourse} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                <input
                  type="text"
                  required
                  value={courseForm.courseName}
                  onChange={(e) => setCourseForm({...courseForm, courseName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter course name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  required
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  rows={3}
                  placeholder="Enter course description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instructor</label>
                <input
                  type="text"
                  required
                  value={courseForm.instructor}
                  onChange={(e) => setCourseForm({...courseForm, instructor: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter instructor name"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Credits</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="6"
                    value={courseForm.credits}
                    onChange={(e) => setCourseForm({...courseForm, credits: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddCourseModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Adding...' : 'Add Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderStudents = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Student Management</h2>
        <button 
          onClick={() => setShowAddStudentModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Student</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Major
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Courses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {universityStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{student.fullName}</div>
                      <div className="text-sm text-gray-500">{student.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{student.studentId}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{student.major}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{student.year}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">-</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-900">
                        <Eye size={16} />
                      </button>
                      <button className="text-blue-600 hover:text-blue-900">
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteStudent(student.id!)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Student</h3>
              <button
                onClick={() => setShowAddStudentModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddStudent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                <input
                  type="text"
                  required
                  value={studentForm.fullName}
                  onChange={(e) => setStudentForm({...studentForm, fullName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter student name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={studentForm.email}
                  onChange={(e) => setStudentForm({...studentForm, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter student email"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                <input
                  type="text"
                  required
                  value={studentForm.studentId}
                  onChange={(e) => setStudentForm({...studentForm, studentId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter student ID"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Major</label>
                <input
                  type="text"
                  required
                  value={studentForm.major}
                  onChange={(e) => setStudentForm({...studentForm, major: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter major"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <select
                  value={studentForm.year}
                  onChange={(e) => setStudentForm({...studentForm, year: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={studentForm.phoneNumber}
                  onChange={(e) => setStudentForm({...studentForm, phoneNumber: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter phone number"
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Adding...' : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Analytics & Reports</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Enrollment Trends</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">This Month</span>
              <span className="text-sm font-medium text-green-600">+15 students</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Last Month</span>
              <span className="text-sm font-medium text-blue-600">+12 students</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average per Month</span>
              <span className="text-sm font-medium text-gray-900">+18 students</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Performance</h3>
          <div className="space-y-4">
            {universityCourses.slice(0, 3).map((course) => (
              <div key={course.id} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{course.courseName}</span>
                <span className="text-sm font-medium text-gray-900">
                  {Math.round((course.enrolled / course.capacity) * 100)}% full
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="text-sm font-medium text-gray-900">Student Report</div>
            <div className="text-xs text-gray-500 mt-1">Download PDF</div>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="text-sm font-medium text-gray-900">Course Report</div>
            <div className="text-xs text-gray-500 mt-1">Download PDF</div>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="text-sm font-medium text-gray-900">Financial Report</div>
            <div className="text-xs text-gray-500 mt-1">Download PDF</div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">University Settings</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">University Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">University Name</label>
              <input
                type="text"
                value={currentUniversity?.uniName || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea
                value={currentUniversity?.address || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Established Year</label>
              <input
                type="text"
                value={currentUniversity?.estYear || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
              Update University Information
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin Name</label>
              <input
                type="text"
                value={user?.name || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <button className="w-full text-left px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Change Password
              </button>
            </div>
            <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
              Update Profile
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-900">Email Notifications</div>
              <div className="text-sm text-gray-500">Receive notifications about new enrollments</div>
            </div>
            <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-900">Auto-approve Enrollments</div>
              <div className="text-sm text-gray-500">Automatically approve student course registrations</div>
            </div>
            <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-900">Weekly Reports</div>
              <div className="text-sm text-gray-500">Send weekly analytics reports via email</div>
            </div>
            <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" defaultChecked />
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

    // Handle sidebar navigation
    if (activeTab === 'analytics') {
      return renderAnalytics();
    }
    if (activeTab === 'settings') {
      return renderSettings();
    }
    
    switch (activeView) {
      case 'overview':
        return renderOverview();
      case 'courses':
        return renderCourses();
      case 'students':
        return renderStudents();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {!['analytics', 'settings'].includes(activeTab) && (
        <div className="flex-shrink-0 px-6 pt-6 pb-4 bg-white border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'courses', label: 'Courses' },
              { id: 'students', label: 'Students' }
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

export default UniversityAdminDashboard;