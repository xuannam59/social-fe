import emojiData from '@social/constants/emoji';
import type { IUserTag } from '@social/types/user.type';
import React, { useCallback } from 'react';

interface IProps {
  userTags: IUserTag[];
  feeling?: string;
  onClickFeeling: () => void;
  onClickUserTag: () => void;
}

const UserTagsDisplay: React.FC<IProps> = ({
  userTags,
  feeling,
  onClickFeeling,
  onClickUserTag,
}) => {
  const renderUserTags = useCallback(() => {
    return (
      <>
        {feeling && (
          <>
            {` đang `}
            <span className=" text-gray-900 text-md inline-block hover:underline cursor-pointer">
              {emojiData.find(e => e.id === feeling)?.emoji || ''}
            </span>
            {` cảm thấy `}
            <span
              className="font-semibold text-gray-900 text-md inline-block hover:underline cursor-pointer"
              onClick={onClickFeeling}
            >
              {emojiData.find(e => e.id === feeling)?.label || ''}
            </span>
          </>
        )}
        {userTags.length > 0 && (
          <>
            {` cùng với `}
            {userTags.slice(0, 3).map((user, index) => (
              <span key={user.id}>
                <span
                  className="font-semibold text-gray-900 text-md inline-block hover:underline cursor-pointer"
                  onClick={onClickUserTag}
                >
                  {user.name}
                </span>

                {index === userTags.length - 2
                  ? ' và '
                  : index < userTags.length - 1
                    ? ', '
                    : ''}
              </span>
            ))}
            {userTags.length > 3 && (
              <>
                <span
                  className="font-semibold text-gray-900 text-md inline-block hover:underline cursor-pointer"
                  onClick={onClickUserTag}
                >
                  {userTags.length - 3} {`người khác`}
                </span>
              </>
            )}
          </>
        )}
      </>
    );
  }, [userTags, onClickFeeling, onClickUserTag, feeling]);

  return <>{renderUserTags()}</>;
};

export default UserTagsDisplay;
