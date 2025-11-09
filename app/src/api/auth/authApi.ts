import axios from 'axios';
import type {
  LoginUserResponse,
  CheckAuthResponse,
  RegisterUserResponse,
  UpdateUserResponse,
  VisitUserResponse,
  RegisterUserData,
  BackendResponse,
} from '../../types/common';

const API_URL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

export const authApi = {
  registerUser: async (user: RegisterUserData): Promise<RegisterUserResponse> => {
    try {
      const { data } = await axios.post<RegisterUserResponse>(`${API_URL}/api/users`, user);
      if (!data) {
        console.log('failed to create user');
      }
      console.log(data);
      return data;
    } catch (err) {
      throw new Error('failed to create user');
    }
  },

  login: async (username: string, password: string): Promise<LoginUserResponse> => {
    try {
      const { data } = await axios.post<LoginUserResponse>(`${API_URL}/api/auth/login`, {
        username,
        password,
      });
      console.log(data);
      return data;
    } catch (error: any) {
      const message = error.response?.data?.message;
      console.log(message);
      throw new Error('Invalid username or password');
    }
  },

  checkAuth: async (): Promise<CheckAuthResponse | null> => {
    try {
      const { data } = await axios.get<CheckAuthResponse>(`${API_URL}/api/auth/me`);
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  updateUser: async (formData: FormData) => {
    try {
      const { data } = await axios.put<UpdateUserResponse>(`${API_URL}/api/user/update`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log(data);
      return data;
    } catch (error: any) {
      throw new Error('failed to update user', error);
    }
  },
  visitUser: async (id: string): Promise<VisitUserResponse> => {
    try {
      const { data } = await axios.get<VisitUserResponse>(`${API_URL}/api/profile/user/${id}`);
      return data;
    } catch (error) {
      throw error;
    }
  },

  checkUsernameAvailibity: async (username: string) => {
    try {
      const response = await axios.get(`${API_URL}/api/users?username=${username}`);
      const data = response.data;
      return data.available;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch username');
      throw error;
    }
  },

  logout: async () => {
    return await axios.post(`${API_URL}/api/auth/logout`);
  },
};
