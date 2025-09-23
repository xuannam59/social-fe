import emojiData from '@social/constants/emoji';
import type { IUserTag } from '@social/types/user.type';
import { Dropdown, Modal } from 'antd';
import React, { useCallback, useState } from 'react';
import { TbX } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import ButtonAddFriend from '../profiles/ButtonAddFriend';
import AvatarUser from './AvatarUser';

interface IProps {
  userTags: IUserTag[];
  feeling?: string;
  onClickFeeling: () => void;
  onClickUserTag: () => void;
  type?: 'createPost' | 'post';
}

const UserTagsDisplay: React.FC<IProps> = ({
  userTags,
  feeling,
  onClickFeeling,
  onClickUserTag,
  type = 'createPost',
}) => {
  const [openViewMore, setOpenViewMore] = useState(false);
  const navigate = useNavigate();

  const handleClickUserTag = useCallback(
    (userId: string) => {
      if (type === 'createPost') {
        onClickUserTag();
      } else {
        navigate(`/${userId}`);
      }
    },
    [type, onClickUserTag, navigate]
  );

  const handleClickViewMore = useCallback(() => {
    if (type === 'createPost') {
      onClickUserTag();
    } else {
      setOpenViewMore(true);
    }
  }, [type, onClickUserTag]);
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
            <span key={user._id}>
              <span
                className="font-semibold text-gray-900 text-md inline-block hover:underline cursor-pointer"
                onClick={() => {
                  handleClickUserTag(user._id);
                }}
              >
                {user.fullname}
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
              <Dropdown
                trigger={['hover']}
                popupRender={() => {
                  return (
                    <div
                      className="flex flex-col bg-black rounded-lg shadow-md p-2 cursor-default"
                      onClick={handleClickViewMore}
                    >
                      {userTags.slice(3).map(user => (
                        <span
                          key={user._id}
                          className="text-white max-w-[150px] truncate"
                        >
                          {user.fullname}
                        </span>
                      ))}
                    </div>
                  );
                }}
                mouseEnterDelay={0.5}
                mouseLeaveDelay={0.2}
              >
                <span
                  className="font-semibold text-gray-900 text-md inline-block hover:underline cursor-pointer"
                  onClick={handleClickViewMore}
                >
                  {userTags.length - 3} {`người khác`}
                </span>
              </Dropdown>
            </>
          )}
        </>
      )}
      {openViewMore && (
        <Modal
          open={openViewMore}
          onCancel={() => setOpenViewMore(false)}
          className="create-post-modal"
          footer={null}
          closable={false}
          maskClosable={false}
          title={false}
          destroyOnHidden={true}
          style={{
            top: 50,
          }}
        >
          <div className="h-fit max-h-[480px] max-w-[548px] flex flex-col pb-3">
            <div className="flex p-2 gap-2 border-b border-gray-200 flex-shrink-0">
              <div className="flex-1 flex items-center justify-center">
                <div className="text-h3 font-bold">Mọi người</div>
              </div>
              <div
                className="h-8 w-8 bg-gray-200 rounded-full flex justify-center items-center cursor-pointer hover:bg-gray-300"
                onClick={() => {
                  setOpenViewMore(false);
                }}
              >
                <TbX size={20} className="text-gray-500" />
              </div>
            </div>
            <div className="pt-2 flex flex-col gap-3 overflow-y-auto">
              {userTags.slice(3).map(user => (
                <div
                  key={user._id}
                  className="flex items-center justify-between px-2"
                >
                  <div className="flex-1 flex items-center gap-2 mr-2">
                    <AvatarUser
                      avatar={user.avatar}
                      size={42}
                      className="cursor-pointer"
                      onClick={() => navigate(`/${user._id}`)}
                    />
                    <div className="flex-1 truncate">
                      <span
                        className="text-base font-medium hover:underline cursor-pointer"
                        onClick={() => {
                          handleClickUserTag(user._id);
                        }}
                      >
                        {user.fullname}
                      </span>
                    </div>
                  </div>

                  <ButtonAddFriend userIdB={user._id} />
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default UserTagsDisplay;
