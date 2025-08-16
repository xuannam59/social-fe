import { Outlet } from 'react-router-dom';
import Header from '../headers/Header';

const DefaultLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100 w-full max-w-full">
      <Header />
      <div className="mt-4 h-[calc(100vh-4.5rem)]">
        <Outlet />
      </div>
    </div>
  );
};

export default DefaultLayout;
