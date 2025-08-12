import { TbTrash } from 'react-icons/tb';

interface ImageGalleryProps {
  images: {
    url: string;
    file: File;
  }[];
  onDelete: () => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, onDelete }) => {
  if (!images || images.length === 0) return null;

  const getGridConfig = (length: number) => {
    if (length === 1) return { cols: 1, spans: [1] };
    if (length === 2) return { cols: 2, spans: [1, 1] };
    if (length === 3) return { cols: 2, spans: [1, 1, 2] };
    if (length === 4) return { cols: 2, spans: [1, 1, 1, 1] };
    if (length === 5) return { cols: 6, spans: [3, 3, 2, 2, 2] };
    if (length > 5) return { cols: 6, spans: [3, 3, 2, 2, 2] };
    return { cols: 1, spans: [1] };
  };

  const { cols, spans } = getGridConfig(images.length);
  const maxDisplay = images.length > 5 ? 5 : images.length;

  return (
    <div className="w-full relative">
      <div className={`grid grid-cols-${cols} gap-2`}>
        {images.slice(0, maxDisplay).map((item, index) => {
          const colSpan = spans[index] || 1;
          const isLastImage = index === 4 && images.length > 5;

          return (
            <div key={index} className={`col-span-${colSpan} relative`}>
              <img
                src={item.url}
                alt="image"
                className={`w-full h-48 object-cover rounded-lg ${
                  images.length === 1 ? 'max-h-96 h-auto' : ''
                }`}
              />
              {isLastImage && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                  <span className="text-white text-2xl font-bold">
                    +{images.length - 5}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Delete button */}
      <div className="absolute top-2 right-2">
        <div
          className="bg-white rounded-full p-2 cursor-pointer hover:bg-gray-100 shadow-md"
          onClick={onDelete}
        >
          <TbTrash size={20} className="text-red-500" />
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;
