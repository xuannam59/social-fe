import CenterContent from '@social/components/homes/CenterContent';
import LeftSidebar from '@social/components/homes/LeftSidebar';
import RightSidebar from '@social/components/homes/RightSidebar';

const HomePages = () => {
  return (
    <>
      <div className="grid grid-cols-13 h-full gap-4 px-4 overflow-y-auto pt-4">
        <div className="col-span-4 h-full">
          <LeftSidebar />
        </div>
        <div className="col-span-5 h-full">
          <CenterContent />
        </div>
        <div className="col-span-4 h-full">
          <RightSidebar />
        </div>
      </div>
    </>
  );
};

export default HomePages;
