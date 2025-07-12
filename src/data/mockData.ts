import { User, University, Course, Student, Enrollment } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'superadmin@lms.com',
    name: 'Super Administrator',
    role: 'super_admin',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'admin@iitd.ac.in',
    name: 'Dr. Rajesh Kumar',
    role: 'university_admin',
    universityId: '1',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    email: 'admin@iitb.ac.in',
    name: 'Dr. Priya Sharma',
    role: 'university_admin',
    universityId: '2',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    email: 'admin@iisc.ac.in',
    name: 'Dr. Arjun Patel',
    role: 'university_admin',
    universityId: '3',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    email: 'student@iitd.ac.in',
    name: 'Aarav Gupta',
    role: 'student',
    universityId: '1',
    studentId: 'IITD2024001',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '6',
    email: 'student@iitb.ac.in',
    name: 'Diya Singh',
    role: 'student',
    universityId: '2',
    studentId: 'IITB2024001',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '7',
    email: 'student@iisc.ac.in',
    name: 'Aryan Mehta',
    role: 'student',
    universityId: '3',
    studentId: 'IISC2024001',
    createdAt: '2024-01-01T00:00:00Z'
  }
];

export const mockUniversities: University[] = [
  {
    id: '1',
    name: 'Indian Institute of Technology Delhi',
    address: 'Hauz Khas, New Delhi, Delhi 110016',
    adminId: '2',
    adminName: 'Dr. Rajesh Kumar',
    establishedYear: 1961,
    totalStudents: 8500,
    totalCourses: 180,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Indian Institute of Technology Bombay',
    address: 'Powai, Mumbai, Maharashtra 400076',
    adminId: '3',
    adminName: 'Dr. Priya Sharma',
    establishedYear: 1958,
    totalStudents: 10200,
    totalCourses: 220,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Indian Institute of Science',
    address: 'CV Raman Avenue, Bengaluru, Karnataka 560012',
    adminId: '4',
    adminName: 'Dr. Arjun Patel',
    establishedYear: 1909,
    totalStudents: 3500,
    totalCourses: 95,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    name: 'Indian Institute of Technology Madras',
    address: 'Sardar Patel Road, Chennai, Tamil Nadu 600036',
    adminId: '8',
    adminName: 'Dr. Kavitha Nair',
    establishedYear: 1959,
    totalStudents: 9800,
    totalCourses: 200,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    name: 'Indian Institute of Technology Kanpur',
    address: 'Kalyanpur, Kanpur, Uttar Pradesh 208016',
    adminId: '9',
    adminName: 'Dr. Suresh Reddy',
    establishedYear: 1959,
    totalStudents: 7200,
    totalCourses: 165,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z'
  }
];

export const mockCourses: Course[] = [
  {
    id: '1',
    name: 'Data Structures and Algorithms',
    code: 'CS201',
    description: 'Comprehensive study of data structures and algorithmic techniques',
    universityId: '1',
    universityName: 'Indian Institute of Technology Delhi',
    instructor: 'Dr. Vikram Agarwal',
    credits: 4,
    duration: '16 weeks',
    capacity: 120,
    enrolled: 115,
    category: 'Computer Science',
    status: 'active',
    materials: [
      {
        id: '1',
        title: 'Course Introduction',
        type: 'document',
        url: '/materials/cs201-intro.pdf',
        description: 'Course syllabus and introduction',
        uploadedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '2',
        title: 'Algorithm Analysis',
        type: 'video',
        url: '/materials/cs201-video1.mp4',
        description: 'Introduction to algorithm complexity',
        uploadedAt: '2024-01-05T00:00:00Z'
      }
    ],
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Advanced Engineering Mathematics',
    code: 'MATH301',
    description: 'Advanced mathematical concepts for engineering applications',
    universityId: '1',
    universityName: 'Indian Institute of Technology Delhi',
    instructor: 'Dr. Sunita Joshi',
    credits: 3,
    duration: '16 weeks',
    capacity: 80,
    enrolled: 76,
    category: 'Mathematics',
    status: 'active',
    materials: [
      {
        id: '3',
        title: 'Linear Algebra Review',
        type: 'document',
        url: '/materials/math301-linear.pdf',
        description: 'Review of linear algebra concepts',
        uploadedAt: '2024-01-01T00:00:00Z'
      }
    ],
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Machine Learning and AI',
    code: 'CS405',
    description: 'Introduction to machine learning algorithms and artificial intelligence',
    universityId: '2',
    universityName: 'Indian Institute of Technology Bombay',
    instructor: 'Dr. Anand Krishnan',
    credits: 4,
    duration: '16 weeks',
    capacity: 150,
    enrolled: 142,
    category: 'Computer Science',
    status: 'active',
    materials: [
      {
        id: '4',
        title: 'ML Fundamentals',
        type: 'video',
        url: '/materials/cs405-ml-intro.mp4',
        description: 'Introduction to machine learning',
        uploadedAt: '2024-01-01T00:00:00Z'
      }
    ],
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    name: 'Quantum Physics',
    code: 'PHY301',
    description: 'Fundamentals of quantum mechanics and applications',
    universityId: '3',
    universityName: 'Indian Institute of Science',
    instructor: 'Dr. Ramesh Chandra',
    credits: 4,
    duration: '16 weeks',
    capacity: 60,
    enrolled: 55,
    category: 'Physics',
    status: 'active',
    materials: [
      {
        id: '5',
        title: 'Quantum Mechanics Basics',
        type: 'document',
        url: '/materials/phy301-quantum.pdf',
        description: 'Introduction to quantum mechanics',
        uploadedAt: '2024-01-01T00:00:00Z'
      }
    ],
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    name: 'Digital Signal Processing',
    code: 'EE302',
    description: 'Digital signal processing techniques and applications',
    universityId: '2',
    universityName: 'Indian Institute of Technology Bombay',
    instructor: 'Dr. Meera Iyer',
    credits: 3,
    duration: '16 weeks',
    capacity: 90,
    enrolled: 85,
    category: 'Electrical Engineering',
    status: 'active',
    materials: [
      {
        id: '6',
        title: 'DSP Introduction',
        type: 'video',
        url: '/materials/ee302-dsp-intro.mp4',
        description: 'Introduction to digital signal processing',
        uploadedAt: '2024-01-01T00:00:00Z'
      }
    ],
    createdAt: '2024-01-01T00:00:00Z'
  }
];

export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Aarav Gupta',
    email: 'aarav@iitd.ac.in',
    universityId: '1',
    universityName: 'Indian Institute of Technology Delhi',
    studentId: 'IITD2024001',
    enrolledCourses: ['1', '2'],
    grades: { '1': 'A', '2': 'B+' },
    year: 2,
    major: 'Computer Science and Engineering',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Diya Singh',
    email: 'diya@iitb.ac.in',
    universityId: '2',
    universityName: 'Indian Institute of Technology Bombay',
    studentId: 'IITB2024001',
    enrolledCourses: ['3', '5'],
    grades: { '3': 'A-', '5': 'A' },
    year: 3,
    major: 'Electrical Engineering',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Aryan Mehta',
    email: 'aryan@iisc.ac.in',
    universityId: '3',
    universityName: 'Indian Institute of Science',
    studentId: 'IISC2024001',
    enrolledCourses: ['4'],
    grades: { '4': 'A+' },
    year: 1,
    major: 'Physics',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    name: 'Kavya Reddy',
    email: 'kavya@iitd.ac.in',
    universityId: '1',
    universityName: 'Indian Institute of Technology Delhi',
    studentId: 'IITD2024002',
    enrolledCourses: ['1'],
    grades: { '1': 'A' },
    year: 1,
    major: 'Computer Science and Engineering',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    name: 'Rohan Sharma',
    email: 'rohan@iitb.ac.in',
    universityId: '2',
    universityName: 'Indian Institute of Technology Bombay',
    studentId: 'IITB2024002',
    enrolledCourses: ['3'],
    grades: { '3': 'B+' },
    year: 2,
    major: 'Computer Science and Engineering',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z'
  }
];

export const mockEnrollments: Enrollment[] = [
  {
    id: '1',
    studentId: '1',
    courseId: '1',
    enrolledAt: '2024-01-01T00:00:00Z',
    status: 'enrolled',
    grade: 'A'
  },
  {
    id: '2',
    studentId: '1',
    courseId: '2',
    enrolledAt: '2024-01-01T00:00:00Z',
    status: 'enrolled',
    grade: 'B+'
  },
  {
    id: '3',
    studentId: '2',
    courseId: '3',
    enrolledAt: '2024-01-01T00:00:00Z',
    status: 'enrolled',
    grade: 'A-'
  },
  {
    id: '4',
    studentId: '2',
    courseId: '5',
    enrolledAt: '2024-01-01T00:00:00Z',
    status: 'enrolled',
    grade: 'A'
  },
  {
    id: '5',
    studentId: '3',
    courseId: '4',
    enrolledAt: '2024-01-01T00:00:00Z',
    status: 'enrolled',
    grade: 'A+'
  }
];

// Legacy exports for backward compatibility
export const mockColleges = mockUniversities;