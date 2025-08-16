import CenterContent from '@social/components/homes/CenterContent';
import LeftSidebar from '@social/components/homes/LeftSidebar';
import RightSidebar from '@social/components/homes/RightSidebar';

const HomePages = () => {
  return (
    <>
      <div className="grid grid-cols-13 h-full gap-4 px-4 relative">
        <div className="col-span-4 h-full max-h-full min-h-full">
          <LeftSidebar />
        </div>
        <div className="col-span-5 h-full max-h-full min-h-full z-10">
          <CenterContent />
        </div>
        <div className="col-span-4 h-full max-h-full min-h-full">
          <RightSidebar />
        </div>
      </div>
    </>
  );
};

export default HomePages;
