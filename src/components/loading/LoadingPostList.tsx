import { Skeleton } from 'antd';

const LoadingPostList = () => {
  return (
    <>
      <div className="bg-white rounded-lg shadow-md w-full">
        <div className="flex flex-col overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-start gap-3 mb-3">
              <Skeleton.Avatar active size={40} />
              <div className="flex-1">
                <Skeleton.Node active style={{ width: 100, height: 20 }} />
              </div>
            </div>

            <div className="space-y-2 mb-3 h-15" />

            <div className="flex items-center justify-between py-2">
              <Skeleton.Node active style={{ width: 100, height: 10 }} />
              <Skeleton.Node active style={{ width: 100, height: 10 }} />
              <Skeleton.Node active style={{ width: 100, height: 10 }} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 w-full">
        <div className="flex flex-col overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-start gap-3 mb-3">
              <Skeleton.Avatar active size={40} />
              <div className="flex-1">
                <Skeleton.Node active style={{ width: 100, height: 20 }} />
              </div>
            </div>

            <div className="space-y-2 mb-3 h-15" />

            <div className="flex items-center justify-between py-2">
              <Skeleton.Node active style={{ width: 100, height: 10 }} />
              <Skeleton.Node active style={{ width: 100, height: 10 }} />
              <Skeleton.Node active style={{ width: 100, height: 10 }} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoadingPostList;
