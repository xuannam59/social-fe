import Loading from '@social/components/loading/Loading';
import { EmojiStyle, type EmojiClickData } from 'emoji-picker-react';
import React, { Suspense, lazy } from 'react';
import { TbMoodSmileBeam } from 'react-icons/tb';

const LazyEmojiPicker = lazy(() => import('emoji-picker-react'));

interface IProps {
  toggleEmojiPicker: () => void;
  onEmojiClick: (emojiObject: EmojiClickData) => void;
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  showEmojiPicker: boolean;
}

const ModalEmoji: React.FC<IProps> = ({
  toggleEmojiPicker,
  onEmojiClick,
  top = 0,
  right = 0,
  bottom = 0,
  left = 0,
  showEmojiPicker,
}) => {
  return (
    <>
      <div
        className={`absolute ${top ? `top-${top}` : ''} ${
          right ? `right-${right}` : ''
        } ${bottom ? `bottom-${bottom}` : ''} ${left ? `left-${left}` : ''}`}
      >
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 cursor-pointer">
          <TbMoodSmileBeam size={25} onClick={toggleEmojiPicker} />
        </div>

        {showEmojiPicker && (
          <div className={`absolute z-50 bottom-10 right-0`}>
            <div className="fixed inset-0 z-40" onClick={toggleEmojiPicker} />

            <div className="relative z-99999">
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

export default ModalEmoji;
