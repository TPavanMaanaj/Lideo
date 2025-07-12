import axios from 'axios';

const BASE_URL = 'http://localhost:8082/api/universities';

export interface University {
  id?: number;
  uniName: string;
  estYear: string;
  address: string;
  status: 'ACTIVE' | 'INACTIVE';
  adminName: string;
  students: number;
  courses: number;
}

export const getAllUniversities = () => {
  return axios.get<University[]>(BASE_URL);
};

export const getUniversityById = (id: number) => {
  return axios.get<University>(`${BASE_URL}/${id}`);
};

export const createUniversity = (data: University) => {
  return axios.post<University>(BASE_URL, data);
};

export const updateUniversity = (id: number, data: University) => {
  return axios.put<University>(`${BASE_URL}/${id}`, data);
};

export const deleteUniversity = (id: number) => {
  return axios.delete(`${BASE_URL}/${id}`);
};
