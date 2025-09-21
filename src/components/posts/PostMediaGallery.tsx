import type { IPreviewMedia } from '@social/types/posts.type';
import React, { useMemo } from 'react';

interface IProps {
  medias: IPreviewMedia[];
  onClick: () => void;
}

const PostMediaGallery: React.FC<IProps> = ({ medias }) => {
  const renderGallery = useMemo(() => {
    const count = medias.length;
    const displayedMedias = count > 5 ? medias.slice(0, 5) : medias;
    const remainingCount = count > 5 ? count - 5 : 0;

    switch (Math.min(count, 5)) {
      case 1:
        return (
          <div className="w-full">
            {displayedMedias.map(media => {
              if (media.type === 'image') {
                return (
                  <div
                    key={media.id}
                    className="max-h-[400px] bg-black border border-gray-200 overflow-hidden "
                  >
                    <div className="flex items-center justify-center ">
                      <img
                        src={media.url}
                        alt="media"
                        className="max-w-[500px] min-w-[378px]"
                        loading="lazy"
                      />
                    </div>
                  </div>
                );
              }
            })}
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-2">
            {displayedMedias.map(media => {
              if (media.type === 'image') {
                return (
                  <div
                    key={media.id}
                    className="h-[250px] bg-black border border-gray-200 overflow-hidden"
                  >
                    <div className="flex items-center justify-center w-full h-full">
                      <img
                        src={media.url}
                        alt="media"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>
                );
              }
            })}
          </div>
        );
      case 3:
        return (
          <div className="grid grid-cols-2">
            {displayedMedias.map((media, index) => {
              if (media.type === 'image') {
                return (
                  <div
                    key={media.id}
                    className={`h-[250px] bg-black border border-gray-200 overflow-hidden ${
                      index === 0 ? 'col-span-2' : ''
                    }`}
                  >
                    <div className="flex items-center justify-center w-full h-full">
                      <img
                        src={media.url}
                        alt="media"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>
                );
              }
            })}
          </div>
        );
      case 4:
        return (
          <div className="grid grid-cols-2">
            {displayedMedias.map(media => {
              if (media.type === 'image') {
                return (
                  <div
                    key={media.id}
                    className="h-[200px] bg-black border border-gray-200 overflow-hidden"
                  >
                    <div className="flex items-center justify-center w-full h-full">
                      <img
                        src={media.url}
                        alt="media"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>
                );
              }
            })}
          </div>
        );
      case 5:
      default:
        return (
          <div className="grid grid-cols-6">
            {displayedMedias.map((media, index) => {
              return (
                <div
                  key={media.id}
                  className={`relative h-[150px] bg-black border border-gray-200 overflow-hidden ${
                    index > 1 ? 'col-span-2' : 'col-span-3'
                  }`}
                >
                  <div className="flex items-center justify-center w-full h-full">
                    <img
                      src={media.url}
                      alt="media"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {index === 4 && remainingCount > 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">
                        +{remainingCount}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
    }
  }, [medias]);

  return <>{renderGallery}</>;
};

export default PostMediaGallery;
