import { useLocation, matchPath } from 'react-router-dom';

export function useHideLayout() {
  const location = useLocation();

  const routes = [
    '/',
    '/signup',
    '/signin',
    '/profile',
    '/posts',
    '/write',
    '/profile/updateProfile',
  ];
  const path = ['/post/:slug', '/profile/user/:id', '/post/update/:slug'];

  const data = path.some((el) => matchPath(`${el}`, location.pathname));
  const validRoutes = routes.includes(location.pathname) || data;

  const removeRoute = (route: string[], start: number, end?: number): boolean => {
    const remove = route.slice(start, end);
    return remove.includes(location.pathname);
  };

  console.log(removeRoute(routes, 1));

  return {
    hideLayout: removeRoute(routes, 1) || data,

    hideSidebar: removeRoute(routes, 0, 3) || !validRoutes,

    hideInHomePage: removeRoute(routes, 0, 1),

    redirect: removeRoute(routes, 1) || data,

    hideElements: removeRoute(routes, 5) || data,
  };
}
