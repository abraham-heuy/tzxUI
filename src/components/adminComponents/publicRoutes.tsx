import { Outlet } from 'react-router-dom';
// just render my pages for now, I am tired of the auth check😅.
const PublicRoute = () => {
  return <Outlet />;
};

export default PublicRoute;