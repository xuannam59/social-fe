import { Outlet } from 'react-router-dom';
import Header from '../headers/Header';
import ShowConversationsListBox from '../homes/ShowConversationsListBox';

const DefaultLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100 w-full max-w-full">
      <Header />
      <div className="h-[calc(100vh-3.5rem)]">
        <Outlet />
      </div>
      <ShowConversationsListBox />
    </div>
  );
};

export default DefaultLayout;
