import axios from 'axios';
import type { BlogPost } from '../../types/common';
const API_URL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

export const likePost = {
  like: async (slug: string) => {
    try {
      const { data } = await axios.post<{ post: BlogPost }>(`${API_URL}/api/post/${slug}/like`);
      return data;
    } catch (error) {
      console.log('failed to create like', error);
      throw error;
    }
  },
};
