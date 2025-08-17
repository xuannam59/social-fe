import {
  base64ToFile,
  getDominantColor as getImageDominantColor,
} from '@social/common/get-info-image';
import {
  Button,
  ColorPicker,
  Form,
  type FormInstance,
  Input,
  Modal,
} from 'antd';
import type { Stage as KonvaStage } from 'konva/lib/Stage';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TbPlus } from 'react-icons/tb';
import { Layer, Stage } from 'react-konva';
import StoryEditableText from './StoryEditableText';
import StoryEditImg from './StoryEditImg';

interface IProps {
  formSubmit: FormInstance<any>;
  image?: File;
  isText: boolean;
  type: string;
  onCancel: () => void;
  handleSave: (file: File) => void;
}

const StoryEdit: React.FC<IProps> = ({
  formSubmit,
  image,
  isText,
  type,
  onCancel,
  handleSave,
}) => {
  const [dominantColor, setDominantColor] = useState<string>('#ffffff');
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const stageRef = useRef<KonvaStage>(null);
  const imagePositionRef = useRef<{ x: number; y: number } | null>(null);
  const [text, setText] = useState<
    {
      id: string;
      text: string;
      color: string;
      x: number;
      y: number;
    }[]
  >([]);
  const [form] = Form.useForm();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (image && type === 'image') {
      getImageDominantColor(image)
        .then(color => setDominantColor(color))
        .catch(error => {
          console.error('Lỗi khi lấy màu từ ảnh:', error);
          setDominantColor('#ffffff');
        });
    }
  }, [image, type]);

  useEffect(() => {
    if (type === 'text') return;
    if (
      stageSize.width > 0 &&
      stageSize.height > 0 &&
      !imagePositionRef.current
    ) {
      const imageWidth = 800; // Giả sử image width cố định
      const imageHeight = 600; // Giả sử image height cố định
      const scale = Math.min(
        stageSize.width / imageWidth,
        stageSize.height / imageHeight
      );
      const finalWidth = imageWidth * scale;
      const finalHeight = imageHeight * scale;

      imagePositionRef.current = {
        x: (stageSize.width - finalWidth) / 2,
        y: (stageSize.height - finalHeight) / 2,
      };
    }
  }, [stageSize.width, stageSize.height, type]);

  const saveStory = useCallback(async () => {
    if (stageRef.current === null) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Tăng pixel ratio để có chất lượng cao
    const pixelRatio = Math.max(3, window.devicePixelRatio || 1);
    canvas.width = stageSize.width * pixelRatio;
    canvas.height = stageSize.height * pixelRatio;

    // Cải thiện chất lượng canvas
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.scale(pixelRatio, pixelRatio);

    ctx.fillStyle = dominantColor;
    ctx.fillRect(0, 0, stageSize.width, stageSize.height);

    // Tạo stageDataURL để vẽ lên canvas
    const stageDataURL = stageRef.current.toDataURL({
      pixelRatio: pixelRatio,
      width: stageSize.width,
      height: stageSize.height,
    });

    const stageImage = new window.Image();
    stageImage.src = stageDataURL;
    stageImage.onload = () => {
      // Cải thiện chất lượng khi vẽ image
      ctx.save();
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(stageImage, 0, 0, stageSize.width, stageSize.height);

      ctx.restore();

      let base64: string;
      let fileName: string;

      try {
        // Thử export WebP
        base64 = canvas.toDataURL('image/webp', 0.95);
        fileName = `story-${Date.now()}.webp`;
      } catch (error) {
        // Nếu WebP không được hỗ trợ, fallback về PNG
        console.warn('WebP không được hỗ trợ, sử dụng PNG');
        base64 = canvas.toDataURL('image/png', 1.0);
        fileName = `story-${Date.now()}.png`;
      }
      const file = base64ToFile(base64, fileName);

      // Gọi handleSave để truyền file về component cha
      handleSave(file);
    };

    setText([]);
  }, [dominantColor, handleSave, stageSize.width, stageSize.height]);

  useEffect(() => {
    if (type === 'text') return;
    const updateStageSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setStageSize({
          width: rect.width,
          height: rect.height,
        });
      }
    };

    updateStageSize();
    window.addEventListener('resize', updateStageSize);

    return () => window.removeEventListener('resize', updateStageSize);
  }, [type]);

  const onFinish = (values: any) => {
    if (!values.text.trim()) return;
    const color =
      typeof values.color === 'string'
        ? values.color
        : values.color?.toHexString?.() || '#000000';

    setText([
      ...text,
      {
        ...values,
        color,
        id: Date.now().toString(),
        x: 100,
        y: 100,
      },
    ]);
    form.resetFields();
    onCancel();
  };

  const onClose = () => {
    onCancel();
  };

  return (
    <>
      <div className="h-full flex flex-col items-center">
        <div className="w-[976px] max-w-[calc(100%-48px)] h-full mt-14 mb-8 mx-6 h-100% bg-white shadow-lg rounded-lg p-4">
          <div className="flex flex-col gap-2 h-full">
            <div className="text-md font-semibold">Xem trước</div>
            <div className="h-full bg-black border border-gray-200 rounded-lg">
              <div className="flex justify-center flex-col gap-2 items-center w-full h-full">
                <div
                  ref={containerRef}
                  className="h-[calc(100%-68px)] aspect-[1/1.7] w-auto rounded-lg border border-gray-200 overflow-hidden relative"
                >
                  <Form
                    form={formSubmit}
                    onFinish={() => {
                      saveStory();
                    }}
                  >
                    {type === 'image' && image && (
                      <Stage
                        width={stageSize.width}
                        height={stageSize.height}
                        ref={stageRef}
                        style={{ backgroundColor: dominantColor }}
                        pixelRatio={Math.max(2, window.devicePixelRatio || 1)}
                        onMouseDown={e => {
                          // Bỏ chọn khi click vào vùng trống
                          const clickedOnEmpty =
                            e.target === e.target.getStage();
                          if (clickedOnEmpty) {
                            setSelectedId(null);
                          }
                        }}
                        onTouchStart={e => {
                          // Bỏ chọn khi touch vào vùng trống
                          const clickedOnEmpty =
                            e.target === e.target.getStage();
                          if (clickedOnEmpty) {
                            setSelectedId(null);
                          }
                        }}
                      >
                        <Layer>
                          <StoryEditImg
                            src={URL.createObjectURL(image)}
                            stageSize={stageSize}
                          />

                          {text.map(item => (
                            <StoryEditableText
                              key={item.id}
                              item={item}
                              isSelected={selectedId === item.id}
                              onSelect={() => setSelectedId(item.id)}
                              onChange={updates => {
                                const newText = text.map(t =>
                                  t.id === item.id ? { ...t, ...updates } : t
                                );
                                setText(newText);
                              }}
                              onRemove={() => {
                                const newText = text.filter(
                                  t => t.id !== item.id
                                );
                                setText(newText);
                                if (selectedId === item.id) {
                                  setSelectedId(null);
                                }
                              }}
                            />
                          ))}
                        </Layer>
                      </Stage>
                    )}
                  </Form>
                </div>
                <div className="text-md text-white">Chỉnh sửa hình ảnh</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {type === 'image' && image && (
        <Modal
          open={isText}
          onCancel={onClose}
          footer={null}
          title="Nội dung văn bản"
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              text: '',
              color: '#000000',
            }}
          >
            <div className="flex justify- gap-2">
              <Form.Item name="text" label="Text" className="flex-1">
                <Input />
              </Form.Item>
              <Form.Item name="color" label="Color">
                <ColorPicker />
              </Form.Item>
            </div>
            <div className="flex justify-end">
              <Button type="primary" onClick={() => form.submit()}>
                <TbPlus />
                Thêm văn bản
              </Button>
            </div>
          </Form>
        </Modal>
      )}
    </>
  );
};

export default StoryEdit;
