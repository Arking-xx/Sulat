import { useAuth } from './auth/useAuth';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLikePost } from './likepost/useLikePost';
import { type BlogPost } from '../types/common';

export const useVisitUser = () => {
  const { user } = useAuth();
  const currentLoggedUserId = user?._id;
  const navigate = useNavigate();
  const visitUser = (posterId: string | undefined) => {
    return currentLoggedUserId === posterId
      ? navigate('/profile')
      : navigate(`/profile/user/${posterId}`);
  };
  return { visitUser };
};

/// for textarea
export const useTextarea = (name: string, value: string | undefined) => {
  useEffect(() => {
    const textareaElement = document.querySelector<HTMLTextAreaElement>(`textarea[name="${name}"]`);
    if (textareaElement) {
      textareaElement.style.height = 'auto';
      textareaElement.style.height = `${textareaElement.scrollHeight}px`;
    }
  }, [name, value]);
};

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

//for search
export function useDebounce<T>(value: T, delay: number) {
  const [debounceValue, setDebounceValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounceValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounceValue;
}

export const useLogout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.log('failed to logout', error);
    }
  };
  return { handleLogout };
};
export const useHandleLike = () => {
  const { toggleLike } = useLikePost();
  const handleLike = (e: React.MouseEvent<SVGSVGElement>, postSlug: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLike(postSlug);
  };
  return { handleLike };
};

// creating and updating post

type BaseFormData = Pick<BlogPost, 'title' | 'content'> & {
  slug?: string;
  images?: FileList;
};

export const useOnsubmit = () => {
  const navigate = useNavigate();
  const onSubmit = async <T extends BaseFormData>(
    data: T,
    api: (formData: FormData) => Promise<any>
  ) => {
    try {
      const formData = new FormData();
      if (data.title) formData.append('title', data.title);
      if (data.content) formData.append('content', data.content);
      if (data.images && data.images[0]) {
        formData.append('image', data.images[0]);
      }
      const response = await api(formData);
      const slug = (response as any).newPost?.slug || (response as any).updatedPost?.slug;

      if (slug) {
        navigate(`/post/${slug}`);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return { onSubmit };
};
