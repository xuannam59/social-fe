import { ROUTES } from '@social/constants/route.constant';
import Login from '@social/pages/auths/Login';
import LayoutAuth from '@social/components/layouts/Auth';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LayoutAuth />}>
          <Route path={ROUTES.AUTH.LOGIN} element={<Login />} />
        </Route>
        <Route path={ROUTES.DEFAULT} element={<div>helloworld</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
