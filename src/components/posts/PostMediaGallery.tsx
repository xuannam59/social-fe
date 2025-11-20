import type { IPreviewMedia } from '@social/types/posts.type';
import { Image } from 'antd';
import React, { useMemo } from 'react';

interface IProps {
  medias: IPreviewMedia[];
  onClick: () => void;
}

const PostMediaGallery: React.FC<IProps> = ({ medias }) => {
  const renderGallery = useMemo(() => {
    const count = medias.length;
    const remainingCount = count > 5 ? count - 5 : 0;

    switch (Math.min(count, 5)) {
      case 1:
        return (
          <div className="w-full">
            <Image.PreviewGroup>
              {medias.map(media => {
                if (media.type === 'image') {
                  return (
                    <div
                      key={media.id}
                      className=" bg-black border border-gray-200 overflow-hidden "
                    >
                      <div className="flex items-center justify-center max-h-[400px] h-full">
                        <Image
                          src={media.url}
                          alt="media"
                          className="w-full h-full max-h-[400px]"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={media.id}
                      className="max-h-[400px] bg-black border border-gray-200 overflow-hidden "
                    >
                      <div className="flex items-center justify-center ">
                        <video
                          src={media.url}
                          className="w-full h-full object-cover"
                          controls
                        />
                      </div>
                    </div>
                  );
                }
              })}
            </Image.PreviewGroup>
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-2">
            <Image.PreviewGroup>
              {medias.map(media => {
                if (media.type === 'image') {
                  return (
                    <div
                      key={media.id}
                      className="h-[400px] bg-black border border-gray-200 overflow-hidden"
                    >
                      <div className="flex items-center justify-center w-full h-full">
                        <Image
                          src={media.url}
                          alt="media"
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={media.id}
                      className="max-h-[400px] bg-black border border-gray-200 overflow-hidden "
                    >
                      <div className="flex items-center justify-center h-full">
                        <video
                          src={media.url}
                          className="w-full h-full object-contain"
                          controls
                        />
                      </div>
                    </div>
                  );
                }
              })}
            </Image.PreviewGroup>
          </div>
        );
      case 3:
        return (
          <div className="grid grid-cols-2">
            <Image.PreviewGroup>
              {medias.map((media, index) => {
                if (media.type === 'image') {
                  return (
                    <div
                      key={media.id}
                      className={`h-[400px] bg-black border border-gray-200 overflow-hidden ${
                        index === 0 ? 'col-span-2' : ''
                      }`}
                    >
                      <div className="flex items-center justify-center w-full h-full">
                        <Image
                          src={media.url}
                          alt="media"
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={media.id}
                      className="max-h-[400px] bg-black border border-gray-200 overflow-hidden "
                    >
                      <div className="flex items-center justify-center h-full">
                        <video
                          src={media.url}
                          className="w-full h-full object-contain"
                          controls
                        />
                      </div>
                    </div>
                  );
                }
              })}
            </Image.PreviewGroup>
          </div>
        );
      case 4:
        return (
          <div className="grid grid-cols-2">
            <Image.PreviewGroup>
              {medias.map(media => {
                if (media.type === 'image') {
                  return (
                    <div
                      key={media.id}
                      className="h-[400px] bg-black border border-gray-200 overflow-hidden"
                    >
                      <div className="flex items-center justify-center w-full h-full">
                        <Image
                          src={media.url}
                          alt="media"
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={media.id}
                      className="max-h-[400px] bg-black border border-gray-200 overflow-hidden "
                    >
                      <div className="flex items-center justify-center h-full">
                        <video
                          src={media.url}
                          className="w-full h-full object-contain"
                          controls
                        />
                      </div>
                    </div>
                  );
                }
              })}
            </Image.PreviewGroup>
          </div>
        );
      case 5:
      default:
        return (
          <div className="grid grid-cols-6">
            <Image.PreviewGroup>
              {medias.map((media, index) => {
                return (
                  <>
                    {index <= 4 ? (
                      <div
                        key={media.id}
                        className={`relative h-[400px] bg-black border border-gray-200 overflow-hidden ${
                          index > 1 ? 'col-span-2' : 'col-span-3'
                        }`}
                      >
                        <div className="flex items-center justify-center w-full h-full">
                          {media.type === 'image' ? (
                            <Image
                              src={media.url}
                              alt="media"
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <video
                              src={media.url}
                              className="w-full h-full object-contain"
                              controls
                              preload="none"
                            />
                          )}
                        </div>

                        {index === 4 && remainingCount > 0 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white text-2xl font-bold">
                              +{remainingCount}
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="hidden">
                        <Image
                          src={media.url}
                          alt="media"
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                  </>
                );
              })}
            </Image.PreviewGroup>
          </div>
        );
    }
  }, [medias]);

  return <>{renderGallery}</>;
};

export default PostMediaGallery;
