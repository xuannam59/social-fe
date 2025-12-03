import LayoutAuth from '@social/components/layouts/Auth.layout';
import DefaultLayout from '@social/components/layouts/Default.layout';
import StoryLayout from '@social/components/layouts/Story.layout';
import { ROUTES } from '@social/constants/route.constant';
import ForgotPasswordPage from '@social/pages/auths/ForgotPasswordPage';
import LoginPage from '@social/pages/auths/LoginPage';
import RegisterPage from '@social/pages/auths/RegisterPage';
import HomePages from '@social/pages/homes/HomePages';
import StoryCreate from '@social/pages/stories/StoryCreate';
import StoryView from '@social/pages/stories/StoryView';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RouterPrivate from './RouterPrivate';
import ProfilePage from '@social/pages/profiles/ProfilePage';
import WatchPage from '@social/pages/watches/WatchPage';
import FriendCategoryPage from '@social/pages/friends/FriendCategoryPage';

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
        <Route element={<RouterPrivate />}>
          <Route element={<DefaultLayout />}>
            <Route path={ROUTES.DEFAULT} element={<HomePages />} />
            <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
            <Route path={ROUTES.WATCH} element={<WatchPage />} />
            <Route path={ROUTES.FRIEND} element={<FriendCategoryPage />} />
            <Route path={ROUTES.SAVED_POST} element={<>saved post</>} />
          </Route>
          <Route element={<StoryLayout />}>
            <Route path={ROUTES.STORY.CREATE} element={<StoryCreate />} />
            <Route
              path={`${ROUTES.STORY.VIEW}/:userId`}
              element={<StoryView />}
            />
          </Route>
        </Route>
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
