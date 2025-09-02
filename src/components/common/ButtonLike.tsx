import { Dropdown, Tooltip } from 'antd';
import React, { useState } from 'react';
import { emojiReactions } from '@social/constants/emoji';

interface IProps {
  onActionLike: (type: number, isLike: boolean) => void;
  children: React.ReactNode;
}

const ButtonLike: React.FC<IProps> = ({ onActionLike, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dropdown
      trigger={['hover']}
      placement="topLeft"
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
              className="w-10 h-10 p-2 rounded-full cursor-pointer"
              onClick={() => {
                onActionLike(emoji.value, true);
                setOpen(false); // đóng ngay khi chọn emoji
              }}
            >
              <Tooltip title={emoji.label}>
                <div className="flex items-center justify-center w-full h-full">
                  <span className="text-3xl font-semibold hover:scale-150 transition-all duration-300">
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
