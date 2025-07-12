export interface User {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'university_admin' | 'student';
  universityId?: string;
  studentId?: string;
  createdAt: string;
}

export interface University {
  id: string;
  name: string;
  address: string;
  adminId: string;
  adminName: string;
  establishedYear: number;
  totalStudents: number;
  totalCourses: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  universityId: string;
  universityName: string;
  instructor: string;
  credits: number;
  duration: string;
  capacity: number;
  enrolled: number;
  category: string;
  status: 'active' | 'inactive';
  materials: CourseMaterial[];
  createdAt: string;
}

export interface CourseMaterial {
  id: string;
  title: string;
  type: 'document' | 'video' | 'link' | 'assignment';
  url: string;
  description: string;
  uploadedAt: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  universityId: string;
  universityName: string;
  studentId: string;
  enrolledCourses: string[];
  grades: Record<string, string>;
  year: number;
  major: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrolledAt: string;
  status: 'enrolled' | 'completed' | 'dropped';
  grade?: string;
}

// Legacy types for backward compatibility
export type College = University;