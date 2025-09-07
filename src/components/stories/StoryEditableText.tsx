import React, { useEffect, useRef, useState } from 'react';
import { Circle, Group, Text } from 'react-konva';
import { Transformer } from 'react-konva';

interface IProps {
  item: any;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (updates: any) => void;
  onRemove: () => void;
}

const StoryEditableText: React.FC<IProps> = ({
  item,
  isSelected,
  onSelect,
  onChange,
  onRemove,
}) => {
  const textRef = useRef<any>(null);
  const trRef = useRef<any>(null);
  const [textWidth, setTextWidth] = useState(80);
  // Kết nối Transformer với text được chọn
  useEffect(() => {
    if (isSelected && trRef.current && textRef.current) {
      trRef.current.nodes([textRef.current]);
      // trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Group
        x={item.x || 100}
        y={item.y || 100}
        draggable
        onDragEnd={e => {
          // Cập nhật vị trí sau khi kéo
          const node = e.target;
          onChange({ x: node.x(), y: node.y() });
        }}
        onClick={onSelect}
        onTap={onSelect}
      >
        <Text
          text={item.text}
          fill={
            typeof item.color === 'string'
              ? item.color
              : item.color?.toHexString?.() || '#000000'
          }
          x={0}
          y={0}
          fontSize={16}
          width={textWidth}
          wrap="word"
          listening={true}
          ref={textRef}
          onTransform={() => {
            const node = textRef.current;
            if (!node) return;
            const rawWidth = node.width() * node.scaleX();
            const newWidth = Math.max(20, rawWidth);
            node.width(newWidth);
            node.scaleX(1);
            setTextWidth(newWidth);
            onChange({ width: newWidth });
          }}
          onTransformEnd={() => {
            const node = textRef.current;
            if (!node) return;
            const rawWidth = node.width() * node.scaleX();
            const newWidth = Math.max(20, rawWidth);
            node.width(newWidth);
            node.scaleX(1);
            setTextWidth(newWidth);
            onChange({ width: newWidth });
          }}
        />

        {isSelected && (
          <Circle
            x={item.width || 100 - 2}
            y={-10}
            radius={12}
            fill="#e5e7eb"
            stroke="#9ca3af"
            strokeWidth={1}
            onClick={e => {
              e.cancelBubble = true; // Ngăn không cho event bubble lên Group
              onRemove();
            }}
            onTap={e => {
              e.cancelBubble = true;
              onRemove();
            }}
          />
        )}
      </Group>

      {isSelected && textRef.current && (
        <Transformer
          ref={trRef}
          nodes={[textRef.current]}
          enabledAnchors={['middle-left', 'middle-right']}
          rotateEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            const minWidth = 20;
            if (newBox.width < minWidth) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

export default StoryEditableText;
