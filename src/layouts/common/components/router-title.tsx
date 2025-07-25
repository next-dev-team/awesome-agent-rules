import { matchRoutes, useLocation } from 'react-router';
import routes from '@/router/modules';

const RouterTitle = () => {
  const location = useLocation();

  // Page Title
  const route = matchRoutes(routes, location)?.pop()?.route;
  const title = route?.title ?? import.meta.env.VITE_APP_TITLE;

  return (
    <>
      <title>{title}</title>
    </>
  );
};

export default RouterTitle;
