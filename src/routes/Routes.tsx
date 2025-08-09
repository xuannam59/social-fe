import { ROUTES } from '@social/constants/route.constant';
import LoginPage from '@social/pages/auths/LoginPage';
import LayoutAuth from '@social/components/layouts/Auth.layout';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RegisterPage from '@social/pages/auths/RegisterPage';
import ForgotPasswordPage from '@social/pages/auths/ForgotPasswordPage';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LayoutAuth />}>
          <Route path={ROUTES.AUTH.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.AUTH.REGISTER} element={<RegisterPage />} />
          <Route path={ROUTES.AUTH.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        </Route>
        <Route path={ROUTES.DEFAULT} element={<div>helloworld</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
