import { Outlet } from 'react-router-dom';
import HeaderStory from '../headers/HeaderStory';

const StoryLayout = () => {
  return (
    <>
      <div className="min-h-screen bg-gray-100 w-full max-w-full">
        <HeaderStory />
        <div className="flex h-screen max-h-screen">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default StoryLayout;
