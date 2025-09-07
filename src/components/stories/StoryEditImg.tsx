import { forwardRef, useEffect, useRef } from 'react';
import { Image } from 'react-konva';
import useImage from 'use-image';

interface IProps {
  src: string;
  stageSize: { width: number; height: number };
  onReady?: () => void;
  onSelect?: () => void;
}

const StoryEditImg = forwardRef<any, IProps>(({ src, stageSize, onReady, onSelect }, ref) => {
  const [image, status] = useImage(src, 'anonymous');
  const imageRef = useRef<any>(null);

  const imagePositionRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (status === 'loaded') {
      onReady?.();
    }
  }, [status, onReady]);

  if (!image) return null;

  const stageWidth = stageSize.width;
  const stageHeight = stageSize.height;
  const imageWidth = image.width;
  const imageHeight = image.height;

  // Tăng pixel ratio để cải thiện chất lượng
  const scale = Math.min(stageWidth / imageWidth, stageHeight / imageHeight);
  const finalWidth = imageWidth * scale;
  const finalHeight = imageHeight * scale;

  // Sử dụng vị trí đã lưu hoặc vị trí mặc định
  const x = imagePositionRef.current
    ? imagePositionRef.current.x
    : (stageWidth - finalWidth) / 2;
  const y = imagePositionRef.current
    ? imagePositionRef.current.y
    : (stageHeight - finalHeight) / 2;

  return (
    <Image
      ref={(node) => {
        imageRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as any).current = node;
      }}
      image={image}
      x={x}
      y={y}
      width={finalWidth}
      height={finalHeight}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      // Cải thiện chất lượng image
      imageSmoothingEnabled={true}
      imageSmoothingQuality="high"
      onDragEnd={e => {
        // Cập nhật vị trí image sau khi kéo
        const node = e.target;
        imagePositionRef.current = { x: node.x(), y: node.y() };
      }}
    />
  );
});

export default StoryEditImg;
