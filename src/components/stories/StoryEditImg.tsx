import React, { useRef } from 'react';
import { Image } from 'react-konva';
import useImage from 'use-image';

interface IProps {
  src: string;
  stageSize: { width: number; height: number };
}

const StoryEditImg: React.FC<IProps> = ({ src, stageSize }) => {
  const [image] = useImage(src, 'anonymous');
  const imageRef = useRef<any>(null);

  const imagePositionRef = useRef<{ x: number; y: number } | null>(null);

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
      ref={imageRef}
      image={image}
      x={x}
      y={y}
      width={finalWidth}
      height={finalHeight}
      draggable
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
};

export default StoryEditImg;
