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
  Spin,
} from 'antd';
import type { TextAreaRef } from 'antd/es/input/TextArea';
import type { EmojiClickData } from 'emoji-picker-react';
import type { Stage as KonvaStage } from 'konva/lib/Stage';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TbPlus } from 'react-icons/tb';
import { Layer, Rect, Stage, Transformer } from 'react-konva';
import ModalEmoji from '../modals/common/ModalEmoji';
import StoryEditableText from './StoryEditableText';
import StoryEditImg from './StoryEditImg';
import type { ITextStory } from '@social/types/stories.type';
import Loading from '../loading/Loading';

interface IProps {
  formSubmit: FormInstance<any>;
  image?: File;
  isText: boolean;
  type: string;
  isLoading: boolean;
  onCancel: () => void;
  handleSave: (file: File) => void;
}

const StoryEdit: React.FC<IProps> = ({
  formSubmit,
  image,
  isText,
  type,
  isLoading,
  onCancel,
  handleSave,
}) => {
  const [dominantColor, setDominantColor] = useState<string>('#ffffff');
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const stageRef = useRef<KonvaStage>(null);
  const imagePositionRef = useRef<{ x: number; y: number } | null>(null);
  const [text, setText] = useState<ITextStory[]>([]);
  const [form] = Form.useForm();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textAreaRef = useRef<TextAreaRef>(null);
  const [imageReady, setImageReady] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  const imageNodeRef = useRef<any>(null);
  const imageTransformerRef = useRef<any>(null);

  useEffect(() => {
    if (!image) {
      setImageSrc(undefined);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(typeof reader.result === 'string' ? reader.result : undefined);
    };
    reader.readAsDataURL(image);
  }, [image]);

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
      const imageWidth = 800;
      const imageHeight = 600;
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
    if (!imageReady && type === 'image') return;

    await new Promise(requestAnimationFrame);

    const pixelRatio = Math.max(3, window.devicePixelRatio || 1);

    stageRef.current.toDataURL({
      pixelRatio,
      mimeType: 'image/webp',
      quality: 0.95,
      callback: (dataUrl: string) => {
        try {
          const file = base64ToFile(dataUrl, `story-${Date.now()}.webp`);
          handleSave(file);
        } catch (e) { 
          try {
            const pngDataUrl = stageRef.current?.toDataURL({
              pixelRatio,
              mimeType: 'image/png',
              quality: 1,
            }) as string;
            const file = base64ToFile(pngDataUrl, `story-${Date.now()}.png`);
            handleSave(file);
          } catch (_) {
            // no-op
          }
        }
      },
    });
  }, [handleSave, imageReady, type]);

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
    form.resetFields();
    onCancel();
  };

  const toggleEmojiPicker = useCallback(() => {
    setShowEmojiPicker(prev => !prev);
    if (showEmojiPicker) {
      formSubmit.focusField('content');
    }
  }, [showEmojiPicker, formSubmit]);

  const onEmojiClick = useCallback(
    (emojiObject: EmojiClickData) => {
      const { emoji } = emojiObject;
      const currentContent: string = formSubmit.getFieldValue('content') || '';

      const el = textAreaRef.current?.resizableTextArea?.textArea as
        | HTMLTextAreaElement
        | undefined;

      if (!el) {
        formSubmit.setFieldValue('content', currentContent + emoji);
        formSubmit.focusField('content');
        return;
      }
      const start = el.selectionStart ?? currentContent.length;
      const end = el.selectionEnd ?? currentContent.length;

      const newContent =
        currentContent.slice(0, start) + emoji + currentContent.slice(end);

      const newCaretPos = start + emoji.length;
      formSubmit.setFieldValue('content', newContent);
      formSubmit.focusField('content');

      requestAnimationFrame(() => {
        const el2 = textAreaRef.current?.resizableTextArea?.textArea;
        if (el2) {
          el2.selectionStart = newCaretPos;
          el2.selectionEnd = newCaretPos;
        }
      });
    },
    [formSubmit]
  );

  return (
    <>
      <div className="h-full flex flex-col items-center ">
        <div className="min-w-0 w-[976px] max-w-[calc(100%-48px)] h-full mt-14 mb-8 mx-auto h-100% bg-white shadow-lg rounded-lg p-4">
          <div className="flex flex-col gap-2 h-full">
            <div className="text-md font-semibold">Xem trước</div>
            <div className="h-full bg-black border border-gray-200 rounded-lg">
              <div className="flex justify-center flex-col gap-2 items-center w-full h-full">
                <div
                  ref={containerRef}
                  className="h-[calc(100%-68px)] aspect-[1/1.7] w-auto relative"
                >
                 <div className="overflow-hidden w-full h-full rounded-lg border border-gray-200">
                    <Form
                      form={formSubmit}
                      onFinish={() => {
                        if (type === 'image') {
                          saveStory();
                        }
                      }}
                      className="h-full w-full"
                      initialValues={{
                        content: '',
                        background: '#3793b6',
                      }}
                    >
                      {type === 'image' && image ? (
                        <Stage
                          width={stageSize.width}
                          height={stageSize.height}
                          ref={stageRef}
                          style={{ backgroundColor: dominantColor }}
                          pixelRatio={Math.max(2, window.devicePixelRatio || 1)}
                          onMouseDown={e => {
                            const target = e.target;
                            const clickedOnEmpty = target === target.getStage();
                            const clickedOnBackground = target.name?.() === 'bg-rect';
                            if (clickedOnEmpty || clickedOnBackground) {
                              setSelectedId(null);
                            }
                          }}
                          onTouchStart={e => {
                            const target = e.target;
                            const clickedOnEmpty = target === target.getStage();
                            const clickedOnBackground = target.name?.() === 'bg-rect';
                            if (clickedOnEmpty || clickedOnBackground) {
                              setSelectedId(null);
                            }
                          }}
                        >
                          <Layer>
                            <Rect
                              x={0}
                              y={0}
                              width={stageSize.width}
                              height={stageSize.height}
                              fill={dominantColor}
                              name="bg-rect"
                            />
                            {image && imageSrc && (
                              <StoryEditImg
                                src={imageSrc}
                                stageSize={stageSize}
                                onReady={() => setImageReady(true)}
                                onSelect={() => setSelectedId('image')}
                                ref={imageNodeRef}
                              />
                            )}

                            {selectedId === 'image' && imageNodeRef.current && (
                              <Transformer
                                ref={imageTransformerRef}
                                nodes={[imageNodeRef.current]}
                                rotateEnabled={false}
                                enabledAnchors={['top-left','top-right','bottom-left','bottom-right','middle-left','middle-right','top-center','bottom-center']}
                                boundBoxFunc={(oldBox, newBox) => {
                                  const minSize = 40;
                                  if (newBox.width < minSize || newBox.height < minSize) {
                                    return oldBox;
                                  }
                                  return newBox;
                                }}
                              />
                            )}

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
                      ) : (
                        <div className="bg-white h-full w-full relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Form.Item name="content" className="w-[80%]">
                              <Input.TextArea
                                ref={textAreaRef}
                                autoSize={true}
                                maxLength={80}
                                className="!bg-white scrollbar-hide font-semibold !text-[16px] !border-none focus:!ring-0 text-center"
                                placeholder="BẮT ĐẦU NHẬP"
                              />
                            </Form.Item>
                          </div>
                        </div>
                      )}
                    </Form>
                  </div>
                  {type === 'text' && (
                    <ModalEmoji
                      toggleEmojiPicker={toggleEmojiPicker}
                      onEmojiClick={onEmojiClick}
                      showEmojiPicker={showEmojiPicker}
                      bottom={2}
                      right={2}
                    />
                  )}
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <Loading/>
                    </div>
                  )}
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
