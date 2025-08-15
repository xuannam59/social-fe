import type { IFile } from '@social/types/post.type';
import { useMemo } from 'react';
import { TbX } from 'react-icons/tb';

interface ImageGalleryProps {
  images: IFile[];
  onDelete: () => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, onDelete }) => {
  const renderImages = useMemo(() => {
    if (!images || images.length === 0) return null;

    const count = images.length;
    switch (count) {
      case 1:
        return (
          <div className="w-full">
            <img
              src={images[0].url}
              alt="image"
              className="w-full h-auto max-h-96 object-cover rounded-lg border border-gray-200"
              loading="lazy"
            />
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-2 gap-1">
            {images.map((item, index) => (
              <img
                key={index}
                src={item.url}
                alt="image"
                className="w-full h-48 object-cover rounded-lg border border-gray-200"
                loading="lazy"
              />
            ))}
          </div>
        );
      case 3:
        return (
          <div className="grid grid-cols-2 gap-1">
            {images.map((item, index) => (
              <img
                key={index}
                src={item.url}
                alt="image"
                className={`w-full h-48 object-cover rounded-lg border border-gray-200 ${index === 2 ? 'col-span-2' : ''}`}
                loading="lazy"
              />
            ))}
          </div>
        );
      case 4:
        return (
          <div className="grid grid-cols-2 gap-1">
            {images.map((item, index) => (
              <img
                key={index}
                src={item.url}
                alt="image"
                className="w-full h-48 object-cover rounded-lg border border-gray-200"
                loading="lazy"
              />
            ))}
          </div>
        );
      case 5:
        return (
          <div className="grid grid-cols-6 gap-1">
            {images.map((item, index) => (
              <img
                key={index}
                src={item.url}
                alt="image"
                className={`w-full h-48 object-cover rounded-lg border border-gray-200 ${index > 1 ? 'col-span-2' : 'col-span-3'}`}
                loading="lazy"
              />
            ))}
          </div>
        );
      default:
        return (
          <div className="grid grid-cols-6 gap-1">
            {images.slice(0, 4).map((item, index) => {
              return (
                <img
                  key={index}
                  src={item.url}
                  alt="image"
                  className={`w-full h-48 object-cover rounded-lg border border-gray-200 ${index > 1 ? 'col-span-2' : 'col-span-3'}`}
                  loading="lazy"
                />
              );
            })}
            <div className="relative col-span-2">
              <img
                src={images[4].url}
                alt="image"
                className="w-full h-48 object-cover rounded-lg border border-gray-200"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-gray-600/20">
                <span className="text-white text-2xl font-bold">
                  + {count - 5}
                </span>
              </div>
            </div>
          </div>
        );
    }
  }, [images]);

  if (!images || images.length === 0) return null;

  return (
    <div className="w-full relative p-2">
      {renderImages}
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

export default ImageGallery;
