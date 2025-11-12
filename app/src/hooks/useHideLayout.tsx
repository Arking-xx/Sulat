import { useLocation, matchPath } from 'react-router-dom';

export function useHideLayout() {
  const location = useLocation();

  const routes = [
    '/',
    '/signup',
    '/signin',
    '/profile',
    '/write',
    '/posts',
    '/profile/updateProfile',
  ];

  const path = ['/post/:slug', '/profile/user/:id', '/post/update/:slug'];
  const excludeFirstElement = routes.slice(1);
  const data = path.some((el) => matchPath(`${el}`, location.pathname));
  const validRoutes = routes.includes(location.pathname) || data;
  console.log('exclude', excludeFirstElement);

  return {
    hideLayout: excludeFirstElement.includes(location.pathname) || data,

    hideSidebar: ['/', '/signin', '/signup'].includes(location.pathname) || !validRoutes,

    hideInHomePage: ['/'].includes(location.pathname),

    redirect: routes.includes(location.pathname) || data,

    hideElements:
      ['/write'].includes(location.pathname) ||
      ['/profile/updateProfile'].includes(location.pathname) ||
      matchPath('/post/update/:slug', location.pathname),
  };
}
