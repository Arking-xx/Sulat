import axios from 'axios';
import type {
  CreatePostResponse,
  GetCurrentLogPostReponse,
  PostResponse,
  PostsResponse,
  UpdatePostResponse,
  DeletePostResponse,
  SearchTitleResponse,
} from '../../types/common';

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
