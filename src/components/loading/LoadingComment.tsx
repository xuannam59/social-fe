import { Skeleton } from 'antd';

const LoadingComment = () => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start gap-2">
        <Skeleton.Avatar active size={40} />
        <div className=" max-w-[80%] flex flex-col gap-1">
          <Skeleton.Node active style={{ width: 300, height: 60 }} />
        </div>
      </div>
      <div className="flex items-start gap-2">
        <Skeleton.Avatar active size={40} />
        <div className=" max-w-[80%] flex flex-col gap-1">
          <Skeleton.Node active style={{ width: 300, height: 60 }} />
        </div>
      </div>
    </div>
  );
};

export default LoadingComment;
