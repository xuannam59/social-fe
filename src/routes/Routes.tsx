import { ROUTES } from '@social/constants/route.constant';
import LoginPage from '@social/pages/auths/LoginPage';
import LayoutAuth from '@social/components/layouts/Auth.layout';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RegisterPage from '@social/pages/auths/RegisterPage';
import ForgotPasswordPage from '@social/pages/auths/ForgotPasswordPage';
import DefaultLayout from '@social/components/layouts/Default.layout';
import HomePages from '@social/pages/homes/HomePages';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LayoutAuth />}>
          <Route path={ROUTES.AUTH.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.AUTH.REGISTER} element={<RegisterPage />} />
          <Route
            path={ROUTES.AUTH.FORGOT_PASSWORD}
            element={<ForgotPasswordPage />}
          />
        </Route>
        <Route element={<DefaultLayout />}>
          <Route path={ROUTES.DEFAULT} element={<HomePages />} />
          <Route path={ROUTES.WATCH} element={<div>helloworld</div>} />
          <Route path={ROUTES.GROUPS} element={<div>helloworld</div>} />
          <Route path="*" element={<div>404</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
