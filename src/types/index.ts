export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'super_admin' | 'university_admin' | 'student';
  universityId?: string;
  studentId?: string;
  createdAt: string;
}

// src/types/User.ts
export interface UserDTO {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  role: 'SUPER_ADMIN' | 'UNIVERSITY_ADMIN' | 'STUDENT';
  usercode: string;
  dept:string;
  year: number;
  universityId: number;
  universityName: string;
  university:Universities;
  est_yr: number;
  status: 'ACTIVE' | 'INACTIVE';
  Courses: Courses;
  grades:Enrollment["grade"];
}
export interface Universities {
  id: number;
  address: string;
  email: string;
  phoneNumber: number;
   name: string;
  universityCode: string; 
  est_yr: number;
  status: 'ACTIVE' | 'INACTIVE';
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

export interface Courses {
  id: string;
  name: string;
  code: string;
  description: string;
  universityId: number;
  universityName: string;
  instructor: string;
  credits: number;
  durationWeeks: number;
  capacity: number;
  enrolled: number;
  category: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  instructorId:number;
  materials: 'DOCUMENT' | 'VIDEO' | 'LINK' | 'ASSINGMENT';
  videoUrl: string;
  documentUrl:string;
  durationMinutes:number;
  sortOrder:number;
}

export interface CourseTopic {
  id: number;
  title: string;
  materials: 'DOCUMENT' | 'VIDEO' | 'LINK' | 'ASSIGNMENT';
  videoUrl: string;
  documentUrl:string,
  description: string;
  courseId: number;
  universityId: string;
  uploadedAt: string;
  durationMinutes:number;
  sortOrder:number
}


export interface Enrollment {
  id: string;
  studentId: number;
  universityId: number;
  courseId: number;
  enrolledAt: string;
  status: 'enrolled' | 'completed' | 'dropped';
  grade: string;
  credits:number;
  Courses: Courses;
  name:string;
  code:string;
  description:string;
  durationWeeks:number;
  category:string;
  materials:CourseTopic[];
  coursestatus: 'ACTIVE' | 'INACTIVE';
  instructorId:number;
  instructor:string;
}