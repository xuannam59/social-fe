const WatchPage = () => {
  return (
    <>
      <div className="flex h-full gap-4 overflow-y-auto">
        <div className="hidden lg:block lg:w-[280px] xl:w-[360px] sticky top-0 left-0">
          <div className="w-full h-full bg-white shadow-md"></div>
        </div>
        <div className="flex-1 flex justify-center h-[100vh]">
          <div className="max-w-[780px] w-full"></div>
        </div>
      </div>
    </>
  );
};

export default WatchPage;
