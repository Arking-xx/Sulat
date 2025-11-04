import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import type {
  LoginPostResponse,
  RegisterUserResponse,
  RegisterUserData,
  CheckAuth,
  CheckAuthRespone,
  VisitUserResponse,
  BackendResponse,
  UpdateUserResponse,
} from '../../types/common';

const API_URL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

const authApi = {
  registerUser: async (user: RegisterUserData): Promise<RegisterUserResponse> => {
    try {
      const { data } = await axios.post<RegisterUserResponse>(`${API_URL}/api/users`, user);
      if (!data) {
        console.log('failed to create user');
      }
      return data;
    } catch (err) {
      throw new Error('failed to create user');
    }
  },

  login: async (username: string, password: string): Promise<LoginPostResponse> => {
    try {
      const { data } = await axios.post<LoginPostResponse>(`${API_URL}/api/auth/login`, {
        username,
        password,
      });
      return data;
    } catch (error: any) {
      const message = error.response?.data?.message;
      console.log(message);
      throw new Error('Invalid username or password');
    }
  },

  checkAuth: async (): Promise<CheckAuth | null> => {
    try {
      const { data } = await axios.get<CheckAuthRespone>(`${API_URL}/api/auth/me`);
      console.log(data.user);
      return data.success ? data.user : null;
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

  logout: async (): Promise<BackendResponse> => {
    return await axios.post(`${API_URL}/api/auth/logout`);
  },
};
export const useUserFind = (id: string) => {
  const visitUser = useQuery({
    queryKey: ['user', id],
    queryFn: () => authApi.visitUser(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  return {
    visitUser,
  };
};

export const useAuth = () => {
  const queryClient = useQueryClient();

  // cache user data for 5 minutes to reduce database
  // calls  during active session
  const { data: user, isLoading } = useQuery({
    queryKey: ['auth'],
    queryFn: authApi.checkAuth,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const registerMutation = useMutation({
    mutationFn: authApi.registerUser,
    onSuccess: (data) => {
      queryClient.setQueryData(['auth'], data.user);
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });

  const loginMutation = useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      authApi.login(username, password),
    onSuccess: (data) => {
      if (data.success && data.user) {
        queryClient.setQueryData(['auth'], data.user);
        queryClient.invalidateQueries({ queryKey: ['auth'] });
      } else if (!data.success) {
        console.log('Login failed', data.error);
      }
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: authApi.updateUser,
    // setting optimistic data
    onSuccess: (data) => {
      queryClient.setQueryData(['auth'], data.user);
      queryClient.invalidateQueries({ queryKey: ['auth'] }); //fall back if setQueryData reflect the data immediatly
      queryClient.invalidateQueries({ queryKey: ['posts'] }); //fall back if setQueryData reflect the data immediatly
    },
  });

  // cache all cached data on logout to prevent ~
  // data leakage between user sessions
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.setQueryData(['auth'], null);
      queryClient.clear();
    },
  });

  return {
    // check for authentication for login action
    user,
    isLoading,
    isAuthenticated: !!user,

    // for async operation
    registerUser: registerMutation.mutateAsync,
    updateUser: updateUserMutation.mutateAsync,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,

    loginError: loginMutation.error,
    updateUserLoading: updateUserMutation.isPending,
  };
};
