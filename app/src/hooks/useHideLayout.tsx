import { useLocation, matchPath } from 'react-router-dom';
export function useHideLayout() {
  const location = useLocation();

  const validRoutes =
    ['/', '/signup', '/signin', '/profile', '/write', '/posts', '/profile/updateProfile'].includes(
      location.pathname
    ) ||
    matchPath('/post/:slug', location.pathname) ||
    matchPath('/profile/user/:id', location.pathname) ||
    matchPath('/post/update/:slug', location.pathname);

  return {
    hideSidebar: ['/', '/signin', '/signup'].includes(location.pathname) || !validRoutes,

    hideInHomePage: ['/'].includes(location.pathname),

    hideElements:
      ['/write'].includes(location.pathname) ||
      ['/profile/updateProfile'].includes(location.pathname) ||
      matchPath('/post/update/:slug', location.pathname),
  };
}
