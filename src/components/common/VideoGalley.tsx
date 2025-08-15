import type { IFile } from '@social/types/post.type';
import React, { useMemo } from 'react';
import { TbPlayerPlayFilled, TbX } from 'react-icons/tb';

interface VideoGalleyProps {
  videos: IFile[];
  onDelete: () => void;
}

const VideoGalley: React.FC<VideoGalleyProps> = ({ videos, onDelete }) => {
  const renderVideos = useMemo(() => {
    if (!videos || videos.length === 0) return null;

    const count = videos.length;
    switch (count) {
      case 1:
        return (
          <div className="w-full relative">
            <video
              src={videos[0].url}
              className="w-full h-auto max-h-96 object-cover border border-gray-200"
              preload="none"
            />
            <div className="absolute top-0 right-0 bottom-0 left-0 bg-gray-600/30 flex items-center justify-center">
              <div className="border-2 border-white rounded-full p-1">
                <TbPlayerPlayFilled size={30} className="text-white" />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <>
            <div className="grid grid-cols-2">
              {videos.map((video, index) => (
                <div className="col-span-2 relative" key={index}>
                  <video
                    src={video.url}
                    className="w-full h-auto max-h-96 object-cover border border-gray-200"
                    preload="none"
                  />
                  <div className="absolute top-0 right-0 bottom-0 left-0 bg-gray-600/30 flex items-center justify-center">
                    <div className="border-2 border-white rounded-full p-1">
                      <TbPlayerPlayFilled size={30} className="text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className="grid grid-cols-2">
              {videos.map((video, index) => (
                <div
                  className={` relative ${index === 0 ? 'col-span-2' : ''}`}
                  key={index}
                >
                  <video
                    src={video.url}
                    className="w-full h-48 object-cover border border-gray-200"
                    preload="none"
                  />
                  <div className="absolute top-0 right-0 bottom-0 left-0 bg-gray-600/30 flex items-center justify-center">
                    <div className="border-2 border-white rounded-full p-1">
                      <TbPlayerPlayFilled size={20} className="text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        );
      case 4:
        return (
          <>
            <div className="grid grid-cols-2">
              {videos.map((video, index) => (
                <div className={` relative `} key={index}>
                  <video
                    src={video.url}
                    className="w-full h-48 object-cover border border-gray-200"
                    preload="none"
                  />
                  <div className="absolute top-0 right-0 bottom-0 left-0 bg-gray-600/30 flex items-center justify-center">
                    <div className="border-2 border-white rounded-full p-1">
                      <TbPlayerPlayFilled size={20} className="text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        );
      case 5:
        return (
          <div className="grid grid-cols-6">
            {videos.map((video, index) => (
              <div
                key={index}
                className={`relative ${index > 1 ? 'col-span-2' : 'col-span-3'}`}
              >
                <video
                  src={video.url}
                  className="w-full h-48 object-cover border border-gray-200"
                  preload="none"
                />
                <div className="absolute top-0 right-0 bottom-0 left-0 bg-gray-600/30 flex items-center justify-center">
                  <div className="border-2 border-white rounded-full p-1">
                    <TbPlayerPlayFilled size={20} className="text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return (
          <>
            <div className="grid grid-cols-6">
              {videos.slice(0, 4).map((video, index) => (
                <div
                  key={index}
                  className={`relative ${index > 1 ? 'col-span-2' : 'col-span-3'}`}
                >
                  <video
                    src={video.url}
                    className="w-full h-48 object-cover border border-gray-200"
                    preload="none"
                  />
                  <div className="absolute top-0 right-0 bottom-0 left-0 bg-gray-600/30 flex items-center justify-center">
                    <div className="border-2 border-white rounded-full p-1">
                      <TbPlayerPlayFilled size={20} className="text-white" />
                    </div>
                  </div>
                </div>
              ))}
              <div className="relative col-span-2">
                <video
                  src={videos[4].url}
                  className="w-full h-48 object-cover border border-gray-200"
                  preload="none"
                />
                <div className="absolute top-0 right-0 bottom-0 left-0 bg-gray-600/30 flex items-center justify-center">
                  <div className="border-2 border-white rounded-full p-1">
                    <TbPlayerPlayFilled size={20} className="text-white" />
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-gray-600/20">
                  <span className="text-white text-2xl font-bold">
                    + {count - 5}
                  </span>
                </div>
              </div>
            </div>
          </>
        );
    }
  }, [videos]);
  return (
    <>
      <div className="w-full relative rounded-lg overflow-hidden">
        {renderVideos}
        <div className="absolute top-0 right-0 bottom-0 left-0 h-full bg-gray-600/30 flex items-center justify-center z-10 rounded-lg">
          <div className="absolute top-2 right-2">
            <div
              className="bg-white rounded-full p-1 cursor-pointer hover:bg-gray-100 shadow-md"
              onClick={onDelete}
            >
              <TbX size={20} className="text-black" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoGalley;
