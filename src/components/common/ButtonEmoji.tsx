import { Button, Tooltip, type FormInstance } from 'antd';
import { EmojiStyle, type EmojiClickData } from 'emoji-picker-react';
import React, { lazy, Suspense, useCallback, useMemo, useState } from 'react';
import { TbMoodSmileBeam } from 'react-icons/tb';
import Loading from '../loading/Loading';
import { calculateFormPosition } from '@social/common/mentions';

interface IProps {
  form: FormInstance;
  inputRef: React.RefObject<any>;
  placements?:
    | 'top'
    | 'bottom'
    | 'bottomLeft'
    | 'bottomRight'
    | 'topLeft'
    | 'topRight';
  size?: number;
  fieldName?: string;
}

const LazyEmojiPicker = lazy(() => import('emoji-picker-react'));

const ButtonEmoji: React.FC<IProps> = ({
  form,
  inputRef,
  placements,
  size = 20,
  fieldName = 'content',
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
      form.focusField(fieldName);
    }
  };

  const onEmojiClick = useCallback(
    (emojiObject: EmojiClickData) => {
      const { emoji } = emojiObject;

      let textAreaElement: HTMLTextAreaElement | null = null;

      if (inputRef.current) {
        if (inputRef.current instanceof HTMLTextAreaElement) {
          textAreaElement = inputRef.current;
        } else if (inputRef.current.querySelector) {
          textAreaElement = inputRef.current.querySelector('textarea');
        } else if (inputRef.current.textareaRef?.current) {
          textAreaElement = inputRef.current.textareaRef.current;
        } else {
          const container =
            inputRef.current.closest('.ant-form-item') ||
            inputRef.current.parentElement ||
            inputRef.current;
          textAreaElement = container.querySelector('textarea');
        }
      }

      if (!textAreaElement && inputRef.current) {
        const inputRect = inputRef.current.getBoundingClientRect();
        const allTextareas = document.querySelectorAll(
          `textarea[id="${fieldName}"]`
        );

        if (allTextareas.length > 0) {
          let closestTextarea = allTextareas[0] as HTMLTextAreaElement;
          let minDistance = Infinity;

          allTextareas.forEach(textarea => {
            const textareaRect = textarea.getBoundingClientRect();
            const distance = Math.sqrt(
              Math.pow(inputRect.left - textareaRect.left, 2) +
                Math.pow(inputRect.top - textareaRect.top, 2)
            );
            if (distance < minDistance) {
              minDistance = distance;
              closestTextarea = textarea as HTMLTextAreaElement;
            }
          });

          textAreaElement = closestTextarea;
        }
      }

      if (!textAreaElement) {
        const currentContent = form.getFieldValue(fieldName) || '';
        form.setFieldValue(fieldName, currentContent + emoji);
        setShowEmojiPicker(false);
        return;
      }

      const textareaCursorStart = textAreaElement.selectionStart || 0;
      const textareaCursorEnd = textAreaElement.selectionEnd || 0;

      const formValue = form.getFieldValue(fieldName) || '';
      console.log(formValue);
      const formCursorStart = calculateFormPosition(
        textareaCursorStart,
        formValue
      );
      const formCursorEnd = calculateFormPosition(textareaCursorEnd, formValue);

      const newFormValue =
        formValue.slice(0, formCursorStart) +
        emoji +
        formValue.slice(formCursorEnd);

      form.setFieldValue(fieldName, newFormValue);

      const inputEvent = new Event('input', { bubbles: true });
      textAreaElement.dispatchEvent(inputEvent);

      const newTextareaCursorPos = textareaCursorStart + emoji.length;

      requestAnimationFrame(() => {
        if (textAreaElement) {
          textAreaElement.focus();
          textAreaElement.setSelectionRange(
            newTextareaCursorPos,
            newTextareaCursorPos
          );
        }
      });
    },
    [form, inputRef, fieldName]
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
