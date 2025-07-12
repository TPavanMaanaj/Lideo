import axios from 'axios';

const BASE_URL = 'http://localhost:8082/api/students';

export interface Student {
  id?: number;
  studentId: string;
  fullName: string;
  email: string;
  major: string;
  year: string;
  phoneNumber: string;
  universityId: number;
}

export const getAllStudents = () => axios.get<Student[]>(BASE_URL);

export const getStudentById = (id: number) => axios.get<Student>(`${BASE_URL}/${id}`);

export const createStudent = (student: Student) => axios.post<Student>(BASE_URL, student);

export const updateStudent = (id: number, student: Student) =>
  axios.put<Student>(`${BASE_URL}/${id}`, student);

export const deleteStudent = (id: number) => axios.delete(`${BASE_URL}/${id}`);
