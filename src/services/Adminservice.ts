import axios from 'axios';

const BASE_URL = 'http://localhost:8082/api/admins';

export interface Admin {
  id?: number;
  adminName: string;
  uniName: string;
  role: string;
  status: 'ACTIVE' | 'INACTIVE';
  email: string;
  students: number;
  phnnum: number;
  department: number;
  adminStatus: 'ACTIVE' | 'INACTIVE';
}

export const getAllAdmins = () => {
  return axios.get<Admin[]>(BASE_URL);
};

export const getAdminById = (id: number) => {
  return axios.get<Admin>(`${BASE_URL}/${id}`);
};

export const createAdmin = (data: Admin) => {
  return axios.post<Admin>(BASE_URL, data);
};

export const updateAdmin = (id: number, data: Admin) => {
  return axios.put<Admin>(`${BASE_URL}/${id}`, data);
};

export const deleteAdmin = (id: number) => {
  return axios.delete(`${BASE_URL}/${id}`);
};
