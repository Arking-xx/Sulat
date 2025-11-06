import { useLocation, matchPath } from 'react-router-dom';
export function useHideLayout() {
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
