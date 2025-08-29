import type { IPreviewMedia } from '@social/types/posts.type';
import { useMemo } from 'react';
import { TbPlayerPlayFilled, TbX } from 'react-icons/tb';

interface IProps {
  medias: IPreviewMedia[];
  onDelete: () => void;
}

const MediaGallery: React.FC<IProps> = ({ medias, onDelete }) => {
  const renderMedia = useMemo(() => {
    if (!medias || medias.length === 0) return null;

    const count = medias.length;
    switch (count) {
      case 1:
        return (
          <div className="w-full">
            {medias.map(media => {
              if (media.type === 'image') {
                return (
                  <img
                    key={media.id}
                    src={media.url}
                    alt="image"
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  />
                );
              } else {
                return (
                  <div key={media.id} className="relative bg-black/50">
                    <video
                      src={media.url}
                      className="w-full h-auto max-h-96 object-contain border border-gray-200"
                      preload="none"
                    />
                    <div className="absolute top-0 right-0 bottom-0 left-0 bg-gray-600/30 flex items-center justify-center">
                      <div className="border-2 border-white rounded-full p-1">
                        <TbPlayerPlayFilled size={30} className="text-white" />
                      </div>
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
            {medias.map((media, index) => {
              if (media.type === 'image') {
                return (
                  <img
                    key={media.id}
                    src={media.url}
                    alt="image"
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                    loading="lazy"
                  />
                );
              } else {
                return (
                  <div
                    key={media.id}
                    className="relative rounded-lg overflow-hidden bg-black/50"
                  >
                    <video
                      src={media.url}
                      className="w-full h-auto max-h-96 object-contain border border-gray-200"
                      preload="none"
                    />
                    <div className="absolute top-0 right-0 bottom-0 left-0 bg-gray-600/30 flex items-center justify-center">
                      <div className="border-2 border-white rounded-full p-1">
                        <TbPlayerPlayFilled size={30} className="text-white" />
                      </div>
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
            {medias.map((media, index) => (
              <div
                key={media.id}
                className={`${index === 2 ? 'col-span-2' : ''} relative bg-black/50`}
              >
                {media.type === 'image' ? (
                  <img
                    src={media.url}
                    alt="image"
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                    loading="lazy"
                  />
                ) : (
                  <>
                    <video
                      src={media.url}
                      className="w-full h-48 object-contain border border-gray-200"
                      preload="none"
                    />
                    <div className="absolute top-0 right-0 bottom-0 left-0 bg-gray-600/30 flex items-center justify-center">
                      <div className="border-2 border-white rounded-full p-1">
                        <TbPlayerPlayFilled size={20} className="text-white" />
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        );
      case 4:
        return (
          <div className="grid grid-cols-2">
            {medias.map((media, index) => {
              if (media.type === 'image') {
                return (
                  <img
                    key={media.id}
                    src={media.url}
                    alt="image"
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                    loading="lazy"
                  />
                );
              } else {
                return (
                  <div key={media.id} className="relative bg-black/50">
                    <video
                      src={media.url}
                      className="w-full h-48 object-contain border border-gray-200"
                      preload="none"
                    />
                    <div className="absolute top-0 right-0 bottom-0 left-0 bg-gray-600/30 flex items-center justify-center">
                      <div className="border-2 border-white rounded-full p-1">
                        <TbPlayerPlayFilled size={20} className="text-white" />
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        );
      case 5:
        return (
          <div className="grid grid-cols-6">
            {medias.map((media, index) => (
              <div
                key={media.id}
                className={`${index > 1 ? 'col-span-2' : 'col-span-3'} relative bg-black/50`}
              >
                {media.type === 'image' ? (
                  <img
                    src={media.url}
                    alt="image"
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                    loading="lazy"
                  />
                ) : (
                  <>
                    <video
                      src={media.url}
                      className="w-full h-48 object-contain border border-gray-200"
                      preload="none"
                    />
                    <div className="absolute top-0 right-0 bottom-0 left-0 bg-gray-600/30 flex items-center justify-center">
                      <div className="border-2 border-white rounded-full p-1">
                        <TbPlayerPlayFilled size={20} className="text-white" />
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        );
      default:
        return (
          <div className="grid grid-cols-6">
            {medias.slice(0, 4).map((media, index) => (
              <div
                key={media.id}
                className={`${index > 1 ? 'col-span-2' : 'col-span-3'} relative bg-black/50`}
              >
                {media.type === 'image' ? (
                  <img
                    src={media.url}
                    alt="image"
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                    loading="lazy"
                  />
                ) : (
                  <>
                    <video
                      src={media.url}
                      className="w-full h-48 object-cover border border-gray-200"
                      preload="none"
                    />
                    <div className="absolute top-0 right-0 bottom-0 left-0 bg-gray-600/30 flex items-center justify-center">
                      <div className="border-2 border-white rounded-full p-1">
                        <TbPlayerPlayFilled size={20} className="text-white" />
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}

            <div className="relative col-span-2 bg-black/50">
              {medias[4].type === 'image' ? (
                <img
                  src={medias[4].url}
                  alt="image"
                  className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  loading="lazy"
                />
              ) : (
                <>
                  <video
                    src={medias[4].url}
                    className="w-full h-48 object-cover border border-gray-200"
                    preload="none"
                  />
                  <div className="absolute top-0 right-0 bottom-0 left-0 bg-gray-600/30 flex items-center justify-center">
                    <div className="border-2 border-white rounded-full p-1">
                      <TbPlayerPlayFilled size={20} className="text-white" />
                    </div>
                  </div>
                </>
              )}
              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-gray-600/20">
                <span className="text-white text-2xl font-bold">
                  + {count - 5}
                </span>
              </div>
            </div>
          </div>
        );
    }
  }, [medias]);

  if (!medias || medias.length === 0) return null;

  return (
    <div className="w-full relative p-2">
      {renderMedia}
      <div className="absolute top-0 right-0 bottom-0 left-0 bg-gray-600/30 flex items-center justify-center z-10 rounded-lg">
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
  );
};

export default MediaGallery;
