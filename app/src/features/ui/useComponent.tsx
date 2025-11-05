import { useLocation, Navigate, Outlet, matchPath, Routes, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { useEffect, useState } from 'react';

export function useComponent() {
  const location = useLocation();

  return {
    hideLayout:
      [
        '/signup',
        '/signin',
        '/profile',
        '/write',
        '/posts',
        '/profile/updateProfile',
        '/chatroom',
      ].includes(location.pathname) ||
      matchPath('/post/:slug', location.pathname) ||
      matchPath('/profile/user/:id', location.pathname) ||
      matchPath('/post/update/:slug', location.pathname),

    hideSidebar: ['/', '/signin', '/signup'].includes(location.pathname),

    hideElements:
      ['/write'].includes(location.pathname) ||
      ['/profile/updateProfile'].includes(location.pathname) ||
      matchPath('/post/update/:slug', location.pathname),
  };
}

export function ProtectedRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" replace />;
}

export function ScrollTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Image preview hook
type useImagePreviewOption = {
  initialImage?: string;
  isBlogPost?: boolean; //optional
};

// option empty object, not causing an error if there's args been pass
export const useImagePreview = (option: useImagePreviewOption = {}) => {
  const { initialImage } = option;

  const [imagePreview, setImagePreview] = useState<string | undefined>(initialImage || undefined);

  useEffect(() => {
    if (initialImage) {
      setImagePreview(initialImage);
    }
  }, [initialImage]);

  useEffect(() => {
    return () => {
      if (imagePreview && !initialImage) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview, initialImage]); // keeps looking on these data

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (imagePreview && !initialImage) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview(URL.createObjectURL(e.target.files![0]));
  };

  const handleRemove = () => {
    if (imagePreview && !initialImage) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview(undefined);
  };

  const resetToInitial = () => {
    if (imagePreview && !initialImage) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview(initialImage);
  };

  return {
    imagePreview,
    setImagePreview,
    handleChange,
    handleRemove,
    resetToInitial,
    hasLocalImage: !!imagePreview && !initialImage,
  };
};

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
