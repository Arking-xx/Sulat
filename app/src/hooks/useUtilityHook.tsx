import { useAuth } from './auth/useAuth';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

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

export function useDebounce<T>(value: T, delay: number) {
  const [debounceValue, setDebounceValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounceValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounceValue;
}
