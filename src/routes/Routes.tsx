import { ROUTES } from '@social/constants/route.constant';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.DEFAULT} element={<div>123</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
