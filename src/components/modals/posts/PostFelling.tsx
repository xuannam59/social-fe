import { convertToSlug } from '@social/common/convert';
import EmptyState from '@social/components/common/EmptyState';
import InputSearch from '@social/components/common/InputSearch';
import emojiData from '@social/constants/emoji';
import type { IEmojiItem } from '@social/types/commons.type';
import { Button } from 'antd';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { TbArrowLeft } from 'react-icons/tb';

interface IProps {
  onBack: () => void;
  addFelling: (felling: string) => void;
  felling: string;
}

const PostFelling: React.FC<IProps> = ({ onBack, addFelling, felling }) => {
  const [search, setSearch] = useState('');
  const [emojiList, setEmojiList] = useState<IEmojiItem[]>(emojiData);

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      const slug = convertToSlug(value);
      const regex = new RegExp(slug, 'i');
      const results = emojiData.filter(item => regex.test(item.slug));
      setEmojiList(results);
    }, 500),
    []
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearch(value);
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  const handleEmojiClick = useCallback(
    (emoji: IEmojiItem) => {
      addFelling(emoji.id);
      onBack();
    },
    [addFelling, onBack]
  );

  useEffect(() => {
    if (felling) {
      const currentEmoji = emojiData.find(emoji => emoji.id === felling);
      if (currentEmoji) {
        setEmojiList([
          currentEmoji,
          ...emojiData.filter(e => e.id !== currentEmoji.id),
        ]);
      }
    }
  }, [felling]);

  return (
    <>
      <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
        <Button type="text" shape="circle" onClick={onBack}>
          <TbArrowLeft size={24} />
        </Button>
        <h2 className="text-xl font-bold text-center flex-1">
          Bạn đang cảm thấy như thế nào?
        </h2>
      </div>
      <div className="flex-1 px-4 py-2 flex flex-col min-h-0">
        <div className="flex gap-2 mb-4 flex-shrink-0">
          <InputSearch
            placeholder="Tìm kiếm"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        {emojiList.length > 0 ? (
          <div className="grid grid-cols-2 overflow-y-auto overflow-x-hidden ">
            {emojiList.map(emoji => (
              <div
                key={emoji.id}
                className={`flex items-center justify-start gap-4 cursor-pointer hover:bg-gray-200 p-2 rounded-lg ${
                  emoji.id === felling ? 'bg-gray-200' : ''
                }`}
                onClick={() => handleEmojiClick(emoji)}
              >
                <div className="flex items-center justify-center w-10 h-10 bg-gray-300 rounded-full">
                  <div className="text-2xl">{emoji.emoji}</div>
                </div>
                <div className="text-sm font-semibold">{emoji.label}</div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </>
  );
};

export default PostFelling;
