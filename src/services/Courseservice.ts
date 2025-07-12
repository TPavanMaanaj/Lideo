import axios from 'axios';

const BASE_URL = 'http://localhost:8082/api/courses';

export interface Course {
  id?: number;
  courseName: string;
  description: string;
  credits: number;
  instructor: string;
  universityId: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export const getAllCourses = () => {
  return axios.get<Course[]>(BASE_URL);
};

export const getCourseById = (id: number) => {
  return axios.get<Course>(`${BASE_URL}/${id}`);
};

export const createCourse = (data: Course) => {
  return axios.post<Course>(BASE_URL, data);
};

export const updateCourse = (id: number, data: Course) => {
  return axios.put<Course>(`${BASE_URL}/${id}`, data);
};

export const deleteCourse = (id: number) => {
  return axios.delete(`${BASE_URL}/${id}`);
};
