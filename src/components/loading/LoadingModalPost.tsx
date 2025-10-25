import { Skeleton } from 'antd';

const LoadingModalPost = () => {
  return (
    <>
      <div className="h-fit max-h-[calc(100vh-3.5rem)] flex flex-col mt-2">
        <div className="border-b border-gray-200 p-3 flex-shrink-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 flex justify-center items-center">
              <Skeleton.Node active style={{ width: 200, height: 20 }} />
            </div>
            <Skeleton.Avatar active size={30} />
          </div>
        </div>

        <div className="flex flex-col overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-start gap-3 mb-3">
              <Skeleton.Avatar active size={40} />
              <div className="flex-1">
                <Skeleton.Node active style={{ width: 100, height: 20 }} />
              </div>
            </div>

            <div className="space-y-2 mb-3 h-30" />

            <div className="flex items-center justify-between py-2">
              <Skeleton.Node active style={{ width: 100, height: 10 }} />
              <Skeleton.Node active style={{ width: 100, height: 10 }} />
              <Skeleton.Node active style={{ width: 100, height: 10 }} />
            </div>
          </div>

          <div className="px-3 mb-3">
            <div className="border-t border-gray-200 pt-2 h-40" />
          </div>
        </div>

        <div className="border-t border-gray-200 p-3">
          <div className="flex items-center gap-3">
            <Skeleton.Avatar active size={40} />
            <div className="flex-1 h-8 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoadingModalPost;
