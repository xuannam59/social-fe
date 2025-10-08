import { Dropdown, Tooltip } from 'antd';
import React, { useState } from 'react';
import { emojiReactions } from '@social/constants/emoji';

interface IProps {
  onActionLike: (type: number, isLike: boolean) => void;
  children: React.ReactNode;
  trigger?: 'hover' | 'click';
  likedType?: number;
}

const ButtonLike: React.FC<IProps> = ({
  onActionLike,
  children,
  trigger = 'hover',
  likedType,
}) => {
  const [open, setOpen] = useState(false);

  const handleActionLike = (type: number, isLike: boolean) => {
    onActionLike(type, isLike);
    setOpen(false);
  };

  return (
    <Dropdown
      trigger={[trigger]}
      placement="top"
      className="cursor-pointer"
      mouseEnterDelay={0.8}
      mouseLeaveDelay={0.2}
      open={open}
      onOpenChange={visible => setOpen(visible)}
      popupRender={() => (
        <div className="flex items-center w-fit bg-white rounded-full shadow-md p-1 border border-gray-300">
          {emojiReactions.map(emoji => (
            <div
              key={emoji.id}
              className={`w-10 h-10 rounded-full cursor-pointer`}
              onClick={() => {
                if (likedType && likedType === emoji.value) {
                  handleActionLike(emoji.value, false);
                } else {
                  handleActionLike(emoji.value, true);
                }
              }}
            >
              <Tooltip title={emoji.label}>
                <div
                  className={`flex items-center justify-center w-full h-full
                    ${likedType && likedType === emoji.value && 'bg-gray-300 rounded-lg'}
                  `}
                >
                  <span
                    className={`text-2xl font-semibold hover:scale-125 transition-all duration-300`}
                  >
                    {emoji.emoji}
                  </span>
                </div>
              </Tooltip>
            </div>
          ))}
        </div>
      )}
    >
      {children}
    </Dropdown>
  );
};

export default ButtonLike;
