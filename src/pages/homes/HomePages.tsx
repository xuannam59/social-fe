import CenterContent from '@social/components/homes/CenterContent';
import LeftSidebar from '@social/components/homes/LeftSidebar';
import RightSidebar from '@social/components/homes/RightSidebar';

const HomePages = () => {
  return (
    <>
      <div className="grid grid-cols-13 h-full gap-4 px-4">
        <div className="col-span-4 min-h-screen">
          <LeftSidebar />
        </div>
        <div className="col-span-5 min-h-screen">
          <CenterContent />
        </div>
        <div className="col-span-4 min-h-screen">
          <RightSidebar />
        </div>
      </div>
    </>
  );
};

export default HomePages;
