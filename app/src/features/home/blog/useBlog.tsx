import { useQueryClient, useQuery, useMutation, useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import type {
  CreatePostResponse,
  GetCurrentLogPostReponse,
  PostResponse,
  PostsResponse,
  UpdatePostResponse,
  DeletePostResponse,
  SearchTitleResponse,
} from '../../../types/common';

const API_URL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

export const blogApi = {
  createPost: async (formData: FormData) => {
    try {
      const { data } = await axios.post<CreatePostResponse>(`${API_URL}/api/post`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log(data.post);
      return data;
    } catch (error) {
      console.log('failed to create post', error);
      throw error;
    }
  },

  getAllPost: async (page: number = 1, limit: number = 10): Promise<PostsResponse> => {
    try {
      const { data } = await axios.get<PostsResponse>(`${API_URL}/api/posts`, {
        params: { page, limit },
      });
      return data;
    } catch (error) {
      console.log('failed to fetch all post ', error);
      throw error;
    }
  },

  getSinglePost: async (slug: string | null | undefined) => {
    try {
      const { data } = await axios.get<PostResponse>(`${API_URL}/api/post/${slug}`);
      console.log('single post', data.post);
      return data.post;
    } catch (error) {
      console.log('failed to fetch post');
      throw error;
    }
  },

  getCurrentUserLogPost: async () => {
    try {
      const { data } = await axios.get<GetCurrentLogPostReponse>(`${API_URL}/api/posts/me`);
      return data.success ? data : null;
    } catch (error: any) {
      console.log(error);
      throw error;
    }
  },

  updatePost: async (formdata: FormData, slug: string | undefined) => {
    if (!slug) {
      throw new Error('slug is required');
    }
    try {
      const { data } = await axios.put<UpdatePostResponse>(
        `${API_URL}/api/post/update/${slug}`,
        formdata,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      return data;
    } catch (error) {
      throw error;
    }
  },

  deletePost: async (slug: string | null) => {
    try {
      const { data } = await axios.delete<DeletePostResponse>(`${API_URL}/api/post/${slug}`);
      console.log(data.deletedPost);
      return data;
    } catch (error) {
      throw error;
    }
  },

  searchTitle: async (title: string) => {
    try {
      const { data } = await axios.get<SearchTitleResponse>(`${API_URL}/api/search?title=${title}`);
      console.log(data);
      return data;
    } catch (error) {
      throw error;
    }
  },
};

export const useBlog = (slug?: string) => {
  const queryClient = useQueryClient();

  const getAllPosts = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam = 1 }) => blogApi.getAllPost(pageParam, 10),
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      if (!lastPage.pagination) return undefined;
      return lastPage.pagination.hasNextPage ? lastPage.pagination.currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    retry: false,
    staleTime: 10_000,
    gcTime: 10 * 60 * 1000,
    refetchInterval: 5000,
  });

  const { data: singlePost } = useQuery({
    queryKey: ['posts', slug],
    queryFn: () => blogApi.getSinglePost(slug!),
    enabled: !!slug,
    staleTime: 10_000,
    gcTime: 10 * 60 * 1000,
    // refetchOnWindowFocus: true,
    // refetchOnMount: true,
    refetchInterval: 3000,
    initialData: () => {
      const cachedData = queryClient.getQueryData<PostsResponse>(['posts']);
      // if (!cachedData?.posts) return undefined;

      const post = cachedData?.posts?.find((post) => post.slug === slug);
      return post;
    },
  });

  const currentUserPost = useQuery({
    queryKey: ['posts', 'me'],
    queryFn: blogApi.getCurrentUserLogPost,
  });

  const createBlogMutation = useMutation({
    mutationFn: blogApi.createPost,
    onSuccess: (data) => {
      console.log('Post created', data);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const { mutateAsync } = useMutation({
    mutationFn: ({ formdata, slug }: { formdata: FormData; slug: string | undefined }) =>
      blogApi.updatePost(formdata, slug),
    onSuccess: (data) => {
      console.log('update post', data);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: blogApi.deletePost,
    onSuccess: (slug) => {
      queryClient.setQueryData(['posts', slug], slug);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  return {
    getAllPosts,
    singlePost,
    currentUserPost,
    createPost: createBlogMutation.mutateAsync,
    deletePost: deletePostMutation.mutateAsync,
    isDeleting: deletePostMutation.isPending,
    mutateAsync,

    isCreating: createBlogMutation.isPending,
  };
};
