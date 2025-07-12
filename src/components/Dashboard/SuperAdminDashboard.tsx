import React, { useState, useEffect } from 'react';
import { 
  Building, 
  Users, 
  BookOpen, 
  TrendingUp, 
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  X,
  RefreshCw,
  UserCheck,
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Award,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import * as UniversityService from '../../services/Universityservice';
import * as AdminService from '../../services/Adminservice';
import * as CourseService from '../../services/Courseservice';
import * as StudentService from '../../services/Studentservice';

interface SuperAdminDashboardProps {
  activeTab: string;
}

const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ activeTab }) => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<'overview' | 'universities' | 'admins' | 'courses' | 'students'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Modal states
  const [showAddUniversityModal, setShowAddUniversityModal] = useState(false);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEntity, setEditingEntity] = useState<any>(null);
  const [editingType, setEditingType] = useState<'university' | 'admin' | 'course' | 'student' | null>(null);

  // Data states
  const [universities, setUniversities] = useState<UniversityService.University[]>([]);
  const [admins, setAdmins] = useState<AdminService.Admin[]>([]);
  const [courses, setCourses] = useState<CourseService.Course[]>([]);
  const [students, setStudents] = useState<StudentService.Student[]>([]);

  // Form states
  const [universityForm, setUniversityForm] = useState({
    uniName: '',
    estYear: '',
    address: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
    adminName: '',
    students: 0,
    courses: 0
  });

  const [adminForm, setAdminForm] = useState({
    adminName: '',
    uniName: '',
    role: 'ADMIN',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
    email: '',
    students: 0,
    phnnum: 0,
    department: 0,
    adminStatus: 'ACTIVE' as 'ACTIVE' | 'INACTIVE'
  });

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
  useEffect(() => {
    switch (activeTab) {
      case 'dashboard':
        setActiveView('overview');
        break;
      case 'universities':
        setActiveView('universities');
        break;
      case 'admins':
        setActiveView('admins');
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
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadUniversities(),
        loadAdmins(),
        loadCourses(),
        loadStudents()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
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

  const loadAdmins = async () => {
    try {
      const response = await AdminService.getAllAdmins();
      setAdmins(response.data);
    } catch (error) {
      console.error('Error loading admins:', error);
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

  const refreshData = async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
  };

  // CRUD Operations for Universities
  const handleAddUniversity = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await UniversityService.createUniversity(universityForm);
      await loadUniversities();
      setShowAddUniversityModal(false);
      resetUniversityForm();
    } catch (error) {
      console.error('Error adding university:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUniversity = async (id: number, data: UniversityService.University) => {
    setIsLoading(true);
    try {
      await UniversityService.updateUniversity(id, data);
      await loadUniversities();
      setShowEditModal(false);
      setEditingEntity(null);
    } catch (error) {
      console.error('Error updating university:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUniversity = async (id: number) => {
    if (!confirm('Are you sure you want to delete this university?')) return;
    
    setIsLoading(true);
    try {
      await UniversityService.deleteUniversity(id);
      await loadUniversities();
    } catch (error) {
      console.error('Error deleting university:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // CRUD Operations for Admins
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await AdminService.createAdmin(adminForm);
      await loadAdmins();
      setShowAddAdminModal(false);
      resetAdminForm();
    } catch (error) {
      console.error('Error adding admin:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAdmin = async (id: number, data: AdminService.Admin) => {
    setIsLoading(true);
    try {
      await AdminService.updateAdmin(id, data);
      await loadAdmins();
      setShowEditModal(false);
      setEditingEntity(null);
    } catch (error) {
      console.error('Error updating admin:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAdmin = async (id: number) => {
    if (!confirm('Are you sure you want to delete this admin?')) return;
    
    setIsLoading(true);
    try {
      await AdminService.deleteAdmin(id);
      await loadAdmins();
    } catch (error) {
      console.error('Error deleting admin:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // CRUD Operations for Courses
  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await CourseService.createCourse(courseForm);
      await loadCourses();
      setShowAddCourseModal(false);
      resetCourseForm();
    } catch (error) {
      console.error('Error adding course:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCourse = async (id: number, data: CourseService.Course) => {
    setIsLoading(true);
    try {
      await CourseService.updateCourse(id, data);
      await loadCourses();
      setShowEditModal(false);
      setEditingEntity(null);
    } catch (error) {
      console.error('Error updating course:', error);
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

  // CRUD Operations for Students
  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await StudentService.createStudent(studentForm);
      await loadStudents();
      setShowAddStudentModal(false);
      resetStudentForm();
    } catch (error) {
      console.error('Error adding student:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStudent = async (id: number, data: StudentService.Student) => {
    setIsLoading(true);
    try {
      await StudentService.updateStudent(id, data);
      await loadStudents();
      setShowEditModal(false);
      setEditingEntity(null);
    } catch (error) {
      console.error('Error updating student:', error);
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

  // Edit handlers
  const handleEdit = (entity: any, type: 'university' | 'admin' | 'course' | 'student') => {
    setEditingEntity(entity);
    setEditingType(type);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingEntity || !editingType) return;

    const id = editingEntity.id;
    switch (editingType) {
      case 'university':
        await handleUpdateUniversity(id, editingEntity);
        break;
      case 'admin':
        await handleUpdateAdmin(id, editingEntity);
        break;
      case 'course':
        await handleUpdateCourse(id, editingEntity);
        break;
      case 'student':
        await handleUpdateStudent(id, editingEntity);
        break;
    }
  };

  // Reset form functions
  const resetUniversityForm = () => {
    setUniversityForm({
      uniName: '',
      estYear: '',
      address: '',
      status: 'ACTIVE',
      adminName: '',
      students: 0,
      courses: 0
    });
  };

  const resetAdminForm = () => {
    setAdminForm({
      adminName: '',
      uniName: '',
      role: 'ADMIN',
      status: 'ACTIVE',
      email: '',
      students: 0,
      phnnum: 0,
      department: 0,
      adminStatus: 'ACTIVE'
    });
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

  // Filter data based on search term
  const filteredUniversities = universities.filter(uni =>
    uni.uniName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    uni.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    uni.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAdmins = admins.filter(admin =>
    admin.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.uniName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCourses = courses.filter(course =>
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStudents = students.filter(student =>
    student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.major.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate live statistics
  const stats = [
    {
      title: 'Total Universities',
      value: universities.length,
      icon: Building,
      color: 'bg-blue-500',
      trend: '+12%'
    },
    {
      title: 'Total Admins',
      value: admins.length,
      icon: UserCheck,
      color: 'bg-green-500',
      trend: '+8%'
    },
    {
      title: 'Total Courses',
      value: courses.length,
      icon: BookOpen,
      color: 'bg-purple-500',
      trend: '+15%'
    },
    {
      title: 'Total Students',
      value: students.length,
      icon: Users,
      color: 'bg-orange-500',
      trend: '+23%'
    },
    {
      title: 'System Revenue',
      value: '₹2.4Cr',
      icon: DollarSign,
      color: 'bg-indigo-500',
      trend: '+18%'
    },
    {
      title: 'Active Enrollments',
      value: students.length * 2, // Simplified calculation
      icon: GraduationCap,
      color: 'bg-pink-500',
      trend: '+25%'
    }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">System Overview</h2>
        <button
          onClick={refreshData}
          disabled={refreshing}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          <span>Refresh Data</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Universities</h3>
          <div className="space-y-3">
            {universities.slice(0, 5).map((university) => (
              <div key={university.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <Building size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{university.uniName}</p>
                    <p className="text-sm text-gray-600">{university.adminName}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  university.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {university.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Students</h3>
          <div className="space-y-3">
            {students.slice(0, 5).map((student) => (
              <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                    <Users size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{student.fullName}</p>
                    <p className="text-sm text-gray-600">{student.major} - Year {student.year}</p>
                  </div>
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

  const renderUniversities = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">University Management</h2>
        <button 
          onClick={() => setShowAddUniversityModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add University</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search universities..."
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
                  University
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Established
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Students
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
              {filteredUniversities.map((university) => (
                <tr key={university.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                        <Building size={20} className="text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{university.uniName}</div>
                        <div className="text-sm text-gray-500">{university.address}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{university.adminName}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{university.estYear}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{university.students}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{university.courses}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      university.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {university.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEdit(university, 'university')}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteUniversity(university.id!)}
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

      {/* Add University Modal */}
      {showAddUniversityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New University</h3>
              <button
                onClick={() => setShowAddUniversityModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddUniversity} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">University Name</label>
                <input
                  type="text"
                  required
                  value={universityForm.uniName}
                  onChange={(e) => setUniversityForm({...universityForm, uniName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter university name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  required
                  value={universityForm.address}
                  onChange={(e) => setUniversityForm({...universityForm, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  rows={3}
                  placeholder="Enter university address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Name</label>
                <input
                  type="text"
                  required
                  value={universityForm.adminName}
                  onChange={(e) => setUniversityForm({...universityForm, adminName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter admin name"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Established Year</label>
                  <input
                    type="text"
                    required
                    value={universityForm.estYear}
                    onChange={(e) => setUniversityForm({...universityForm, estYear: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., 1961"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={universityForm.status}
                    onChange={(e) => setUniversityForm({...universityForm, status: e.target.value as 'ACTIVE' | 'INACTIVE'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddUniversityModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Adding...' : 'Add University'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderAdmins = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Admin Management</h2>
        <button 
          onClick={() => setShowAddAdminModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Admin</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search admins..."
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
                  Admin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  University
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Students
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
              {filteredAdmins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3">
                        <UserCheck size={20} className="text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{admin.adminName}</div>
                        <div className="text-sm text-gray-500">{admin.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{admin.uniName}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{admin.role}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{admin.students}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      admin.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {admin.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEdit(admin, 'admin')}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteAdmin(admin.id!)}
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

      {/* Add Admin Modal */}
      {showAddAdminModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Admin</h3>
              <button
                onClick={() => setShowAddAdminModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Name</label>
                <input
                  type="text"
                  required
                  value={adminForm.adminName}
                  onChange={(e) => setAdminForm({...adminForm, adminName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter admin name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={adminForm.email}
                  onChange={(e) => setAdminForm({...adminForm, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter email address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
                <select
                  required
                  value={adminForm.uniName}
                  onChange={(e) => setAdminForm({...adminForm, uniName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select University</option>
                  {universities.map((uni) => (
                    <option key={uni.id} value={uni.uniName}>{uni.uniName}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="number"
                  required
                  value={adminForm.phnnum}
                  onChange={(e) => setAdminForm({...adminForm, phnnum: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter phone number"
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddAdminModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Adding...' : 'Add Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
                  University
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
              {filteredCourses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{course.courseName}</div>
                      <div className="text-sm text-gray-500">{course.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{course.instructor}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {universities.find(u => u.id === course.universityId)?.uniName || 'Unknown'}
                  </td>
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
                      <button 
                        onClick={() => handleEdit(course, 'course')}
                        className="text-blue-600 hover:text-blue-900"
                      >
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
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
                <select
                  required
                  value={courseForm.universityId}
                  onChange={(e) => setCourseForm({...courseForm, universityId: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value={0}>Select University</option>
                  {universities.map((uni) => (
                    <option key={uni.id} value={uni.id}>{uni.uniName}</option>
                  ))}
                </select>
              </div>
              
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
                  University
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Major
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                        <Users size={20} className="text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{student.fullName}</div>
                        <div className="text-sm text-gray-500">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{student.studentId}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {universities.find(u => u.id === student.universityId)?.uniName || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{student.major}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{student.year}</td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEdit(student, 'student')}
                        className="text-blue-600 hover:text-blue-900"
                      >
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
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
                <select
                  required
                  value={studentForm.universityId}
                  onChange={(e) => setStudentForm({...studentForm, universityId: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value={0}>Select University</option>
                  {universities.map((uni) => (
                    <option key={uni.id} value={uni.id}>{uni.uniName}</option>
                  ))}
                </select>
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

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">System Settings</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Universities</span>
              <span className="text-sm font-medium text-gray-900">{universities.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Admins</span>
              <span className="text-sm font-medium text-gray-900">{admins.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Courses</span>
              <span className="text-sm font-medium text-gray-900">{courses.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Students</span>
              <span className="text-sm font-medium text-gray-900">{students.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">System Uptime</span>
              <span className="text-sm font-medium text-gray-900">99.9%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Database Size</span>
              <span className="text-sm font-medium text-gray-900">2.4 GB</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900">Auto Backup</div>
                <div className="text-sm text-gray-500">Automatically backup data daily</div>
              </div>
              <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900">Email Notifications</div>
                <div className="text-sm text-gray-500">Send system notifications via email</div>
              </div>
              <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900">Maintenance Mode</div>
                <div className="text-sm text-gray-500">Enable maintenance mode</div>
              </div>
              <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Universal Edit Modal
  const renderEditModal = () => {
    if (!showEditModal || !editingEntity || !editingType) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Edit {editingType.charAt(0).toUpperCase() + editingType.slice(1)}
            </h3>
            <button
              onClick={() => setShowEditModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {editingType === 'university' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">University Name</label>
                  <input
                    type="text"
                    value={editingEntity.uniName || ''}
                    onChange={(e) => setEditingEntity({...editingEntity, uniName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Admin Name</label>
                  <input
                    type="text"
                    value={editingEntity.adminName || ''}
                    onChange={(e) => setEditingEntity({...editingEntity, adminName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    value={editingEntity.address || ''}
                    onChange={(e) => setEditingEntity({...editingEntity, address: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Established Year</label>
                  <input
                    type="text"
                    value={editingEntity.estYear || ''}
                    onChange={(e) => setEditingEntity({...editingEntity, estYear: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={editingEntity.status || 'ACTIVE'}
                    onChange={(e) => setEditingEntity({...editingEntity, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </>
            )}

            {editingType === 'admin' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Admin Name</label>
                  <input
                    type="text"
                    value={editingEntity.adminName || ''}
                    onChange={(e) => setEditingEntity({...editingEntity, adminName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editingEntity.email || ''}
                    onChange={(e) => setEditingEntity({...editingEntity, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
                  <select
                    value={editingEntity.uniName || ''}
                    onChange={(e) => setEditingEntity({...editingEntity, uniName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select University</option>
                    {universities.map((uni) => (
                      <option key={uni.id} value={uni.uniName}>{uni.uniName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="number"
                    value={editingEntity.phnnum || ''}
                    onChange={(e) => setEditingEntity({...editingEntity, phnnum: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <input
                    type="text"
                    value={editingEntity.role || ''}
                    onChange={(e) => setEditingEntity({...editingEntity, role: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={editingEntity.status || 'ACTIVE'}
                    onChange={(e) => setEditingEntity({...editingEntity, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </>
            )}

            {editingType === 'course' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                  <input
                    type="text"
                    value={editingEntity.courseName || ''}
                    onChange={(e) => setEditingEntity({...editingEntity, courseName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instructor</label>
                  <input
                    type="text"
                    value={editingEntity.instructor || ''}
                    onChange={(e) => setEditingEntity({...editingEntity, instructor: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={editingEntity.description || ''}
                    onChange={(e) => setEditingEntity({...editingEntity, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Credits</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={editingEntity.credits || ''}
                    onChange={(e) => setEditingEntity({...editingEntity, credits: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
                  <select
                    value={editingEntity.universityId || ''}
                    onChange={(e) => setEditingEntity({...editingEntity, universityId: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select University</option>
                    {universities.map((uni) => (
                      <option key={uni.id} value={uni.id}>{uni.uniName}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {editingType === 'student' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                  <input
                    type="text"
                    value={editingEntity.fullName || ''}
                    onChange={(e) => setEditingEntity({...editingEntity, fullName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editingEntity.email || ''}
                    onChange={(e) => setEditingEntity({...editingEntity, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                  <input
                    type="text"
                    value={editingEntity.studentId || ''}
                    onChange={(e) => setEditingEntity({...editingEntity, studentId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Major</label>
                  <input
                    type="text"
                    value={editingEntity.major || ''}
                    onChange={(e) => setEditingEntity({...editingEntity, major: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <select
                    value={editingEntity.year || '1'}
                    onChange={(e) => setEditingEntity({...editingEntity, year: e.target.value})}
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
                    value={editingEntity.phoneNumber || ''}
                    onChange={(e) => setEditingEntity({...editingEntity, phoneNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
                  <select
                    value={editingEntity.universityId || ''}
                    onChange={(e) => setEditingEntity({...editingEntity, universityId: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select University</option>
                    {universities.map((uni) => (
                      <option key={uni.id} value={uni.id}>{uni.uniName}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>
          
          <div className="flex space-x-3 pt-6">
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (isLoading && (universities.length === 0 && admins.length === 0 && courses.length === 0 && students.length === 0)) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading live data from database...</p>
          </div>
        </div>
      );
    }

    // Handle sidebar navigation
    if (activeTab === 'analytics') {
      return renderSettings(); // Using settings as analytics for now
    }
    if (activeTab === 'settings') {
      return renderSettings();
    }
    
    switch (activeView) {
      case 'overview':
        return renderOverview();
      case 'universities':
        return renderUniversities();
      case 'admins':
        return renderAdmins();
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
              { id: 'universities', label: 'Universities' },
              { id: 'admins', label: 'Admins' },
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

      {/* Universal Edit Modal */}
      {renderEditModal()}
    </div>
  );
};

export default SuperAdminDashboard;