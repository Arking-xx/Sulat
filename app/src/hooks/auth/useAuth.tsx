import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { authApi } from '../../api/auth/authApi';
import axios from 'axios';

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
      queryClient.setQueryData(['auth'], data);
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });

  const loginMutation = useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      authApi.login(username, password),
    onSuccess: (data) => {
      queryClient.setQueryData(['auth'], data);
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        console.log('Login failed', error.response?.data?.error);
      }
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: authApi.updateUser,
    // setting optimistic data
    onSuccess: (data) => {
      queryClient.setQueryData(['auth'], data);
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
