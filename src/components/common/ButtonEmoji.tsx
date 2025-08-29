import { Button, Tooltip, type FormInstance } from 'antd';
import { EmojiStyle, type EmojiClickData } from 'emoji-picker-react';
import React, { lazy, Suspense, useCallback, useMemo, useState } from 'react';
import { TbMoodSmileBeam } from 'react-icons/tb';
import Loading from '../loading/Loading';

interface IProps {
  form: FormInstance;
  inputRef: React.RefObject<any>;
  field: string;
  placements?:
    | 'top'
    | 'bottom'
    | 'bottomLeft'
    | 'bottomRight'
    | 'topLeft'
    | 'topRight';
  size?: number;
}

const LazyEmojiPicker = lazy(() => import('emoji-picker-react'));

const ButtonEmoji: React.FC<IProps> = ({
  form,
  inputRef,
  field,
  placements,
  size = 20,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const place = useMemo(() => {
    switch (placements) {
      case 'top':
        return 'top-10';
      case 'bottom':
        return 'bottom-10';
      case 'bottomLeft':
        return 'bottom-10 left-0';
      case 'bottomRight':
        return 'bottom-10 right-0';
      case 'topLeft':
        return 'top-10 left-0';
      case 'topRight':
        return 'top-10 right-0';
      default:
        return 'bottom-10 right-0';
    }
  }, [placements]);

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(prev => !prev);
    if (showEmojiPicker) {
      form.focusField(field);
    }
  };

  const onEmojiClick = useCallback(
    (emojiObject: EmojiClickData) => {
      const { emoji } = emojiObject;

      let textAreaElement: HTMLTextAreaElement | null = null;

      if (inputRef.current) {
        if (inputRef.current.querySelector) {
          textAreaElement = inputRef.current.querySelector('textarea');
        } else if (inputRef.current.textareaRef?.current) {
          textAreaElement = inputRef.current.textareaRef.current;
        }
      }

      if (!textAreaElement) {
        const textareas = document.querySelectorAll(
          'textarea[placeholder="Thêm bình luận..."]'
        );
        if (textareas.length > 0) {
          textAreaElement = textareas[
            textareas.length - 1
          ] as HTMLTextAreaElement;
        }
      }

      if (!textAreaElement) {
        const currentContent = form.getFieldValue(field) || '';
        form.setFieldValue(field, currentContent + emoji);
        setShowEmojiPicker(false);
        return;
      }

      const start = textAreaElement.selectionStart || 0;
      const end = textAreaElement.selectionEnd || 0;
      const currentContent = textAreaElement.value || '';

      const newContent =
        currentContent.slice(0, start) + emoji + currentContent.slice(end);

      const newCaretPos = start + emoji.length;

      form.setFieldValue(field, newContent);

      const inputEvent = new Event('input', { bubbles: true });
      textAreaElement.value = newContent;
      textAreaElement.dispatchEvent(inputEvent);

      requestAnimationFrame(() => {
        if (textAreaElement) {
          textAreaElement.focus();
          textAreaElement.setSelectionRange(newCaretPos, newCaretPos);
        }
      });
    },
    [form, inputRef, field]
  );

  return (
    <>
      <div className="relative">
        <Tooltip title="Biểu tượng cảm xúc">
          <Button type="text" shape="circle" onClick={toggleEmojiPicker}>
            <TbMoodSmileBeam size={size} className="text-gray-500" />
          </Button>
        </Tooltip>
        {showEmojiPicker && (
          <div className={`absolute z-50 ${place}`}>
            <div className="fixed inset-0 z-40 " onClick={toggleEmojiPicker} />

            <div className="relative z-50">
              <div className="bg-white rounded-lg shadow-lg border border-gray-200">
                <Suspense
                  fallback={
                    <div className="w-[300px] h-[250px] flex items-center justify-center">
                      <Loading />
                    </div>
                  }
                >
                  <LazyEmojiPicker
                    onEmojiClick={onEmojiClick}
                    width={300}
                    height={250}
                    previewConfig={{ showPreview: false }}
                    searchDisabled={true}
                    emojiStyle={EmojiStyle.FACEBOOK}
                  />
                </Suspense>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ButtonEmoji;
