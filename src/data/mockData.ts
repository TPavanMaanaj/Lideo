import { User, University, Courses, Enrollment, Universities, CourseTopic } from '../types';
import axios from 'axios';
import { UserDTO } from '../types';

const API_URL = 'http://localhost:8082/api';

export const getUsersByUniversityAndRole = async (
  universityId: number,
  role: 'SUPER_ADMIN' | 'UNIVERSITY_ADMIN' | 'STUDENT'
): Promise<UserDTO[]> => {
  const response = await axios.get<UserDTO[]>(`${API_URL}/users/by-role`, {
    params: {
      universityId,
      role,
    },
  });
  return response.data;
};

export const getCourseById = async (universityId: number): Promise<Courses[]> => {
  const response = await axios.get<Courses[]>(`${API_URL}/courses`, {
    params: {
      universityId,
    },
  });
  return response.data;
};

export const getCourses = async (universityId:number): Promise<Courses[]> => {
  const response = await axios.get<Courses[]>(`${API_URL}/courses/by-university/${universityId}`);
  return response.data;
};

export const getEnrollments = async (universityId: number): Promise<Enrollment[]> => {
  const response = await axios.get<Enrollment[]>(`${API_URL}/enrollments`, {
    params: {
      universityId,
    },
  });
  return response.data;
}

export const getUniversities = async (): Promise<Universities[]> => {
  const response = await axios.get<Universities[]>(`${API_URL}/universities`);
  return response.data;
};

export const getCoursesById = async (universityId: number) : Promise<Courses[]> => {
  const response = await axios.get<Courses[]>(`${API_URL}/courses`, {
    params: {
      universityId,
    },
  });
  return response.data;
};

export const getUniversityByRole = async (role: 'SUPER_ADMIN' | 'UNIVERSITY_ADMIN' | 'STUDENT'): Promise<UserDTO[]> => {
  const response = await axios.get<UserDTO[]>(`${API_URL}/users/by-role`, {
    params: {
      role,
    },
  });
  return response.data;
};
export const getStudentCountByUniversity = async (universityId: number): Promise<number> => {
  const response = await axios.get<number>(`http://localhost:8082/api/users/university/${universityId}/student-count`);
  return response.data;
};

export const getCourseTopics = async (courseId: number): Promise<CourseTopic[]> => {
  const response = await axios.get<CourseTopic[]>(`${API_URL}/topics/by-course/${courseId}`);
  return response.data;
};

