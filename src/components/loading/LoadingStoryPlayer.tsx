import { Skeleton } from "antd"

const LoadingStoryPlayer = () => {
  return (
    <>
      <div className="absolute inset-0 m-3 h-fit">
        <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton.Avatar active size={40} />
              <Skeleton.Node active style={{ width: 100, height: 20 }} />
            </div>
        </div>
      </div>
      <div className="w-full h-full bg-gray-200"/>
    </>
  )
}

export default LoadingStoryPlayer