import CenterContent from '@social/components/homes/CenterContent';
import LeftSidebar from '@social/components/homes/LeftSidebar';
import RightSidebar from '@social/components/homes/RightSidebar';

const HomePages = () => {
  return (
    <>
      <div className="flex h-full gap-4 overflow-y-auto pt-4">
        <div className="w-[360px] sticky top-0 left-0 hidden lg:block">
          <LeftSidebar />
        </div>
        <div className="flex-1 flex justify-center h-[100vh]">
          <div className="max-w-[680px]">
            <CenterContent />
          </div>
        </div>
        <div className="w-[360px] sticky top-0 right-0 hidden lg:block">
          <RightSidebar />
        </div>
      </div>
    </>
  );
};

export default HomePages;
