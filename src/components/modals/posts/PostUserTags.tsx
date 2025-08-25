import InputSearch from '@social/components/common/InputSearch';
import EmptyState from '@social/components/common/EmptyState';
import defaultAvatar from '@social/images/default-avatar.webp';
import type { IUserTag } from '@social/types/user.type';
import { Avatar, Button, Modal, Typography } from 'antd';
import React, { useCallback, useMemo, useState } from 'react';
import { TbArrowLeft, TbX } from 'react-icons/tb';

interface IProps {
  onBack: () => void;
  addUserTag: (user: IUserTag[]) => void;
  userTags: IUserTag[];
}

const { Text } = Typography;

const PostUserTags: React.FC<IProps> = ({ onBack, addUserTag, userTags }) => {
  const [selectedUser, setSelectedUser] = useState<IUserTag[]>(userTags);
  const listUser = useMemo(() => {
    const allUsers: IUserTag[] = [
      {
        id: '1',
        name: 'John Doe',
        avatar: defaultAvatar,
      },
      {
        id: '2',
        name: 'Jane Doe',
        avatar: defaultAvatar,
      },

      {
        id: '3',
        name: 'John Doe',
        avatar: defaultAvatar,
      },
      {
        id: '4',
        name: 'John Doe',
        avatar: defaultAvatar,
      },

      {
        id: '5',
        name: 'John Doe',
        avatar: defaultAvatar,
      },
    ];

    return allUsers.filter(
      user => !selectedUser.some(taggedUser => taggedUser.id === user.id)
    );
  }, [selectedUser]);

  const onSelectUserTag = useCallback((user: IUserTag) => {
    setSelectedUser(prev => [...prev, user]);
  }, []);

  const handleDone = useCallback(() => {
    addUserTag(selectedUser);
    onBack();
  }, [selectedUser, addUserTag, onBack]);

  const handleCancel = useCallback(() => {
    onBack();
    addUserTag([]);
    setSelectedUser([]);
  }, [onBack, addUserTag]);

  const handleConfirm = useCallback(() => {
    {
      if (selectedUser.length > 0) {
        Modal.confirm({
          title: 'Confirm',
          content:
            'Nếu bạn đóng thì những sự thay đổi này sẽ không được lưu lại',
          onOk: handleDone,
          onCancel: handleCancel,
          okText: 'Lưu lại',
          cancelText: 'Đóng',
        });
      } else {
        onBack();
      }
    }
  }, [selectedUser, onBack, handleDone, handleCancel]);

  return (
    <>
      <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
        <Button
          type="text"
          shape="circle"
          onClick={handleConfirm}
          className="text-primary"
        >
          <TbArrowLeft size={24} />
        </Button>
        <h2 className="text-xl font-bold text-center flex-1">
          Chọn người để gắn thẻ
        </h2>
      </div>

      <div className="flex-1 px-4 py-2 flex flex-col min-h-0">
        <div className="flex gap-2 mb-4 flex-shrink-0">
          <InputSearch placeholder="Tìm kiếm" />
          <Button type="link" onClick={handleDone}>
            Xong
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {selectedUser && selectedUser.length > 0 && (
            <div className="mb-2">
              <Text
                type="secondary"
                className="block mb-2 !text-md font-semibold"
              >
                ĐÃ GẮN THẺ
              </Text>
              <div className="flex flex-wrap gap-1 border border-gray-200 rounded-md p-3">
                {selectedUser.map(user => (
                  <div
                    key={user.id}
                    className="flex items-center py-1 px-2 justify-between bg-primary/10 text-primary rounded-md w-fit"
                  >
                    <div className="mr-2">{user.name}</div>
                    <Button
                      type="text"
                      shape="circle"
                      size="small"
                      onClick={() =>
                        setSelectedUser(prev =>
                          prev.filter(item => item.id !== user.id)
                        )
                      }
                      className="!text-primary !p-1"
                    >
                      <TbX />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Text type="secondary" className="block !text-md font-semibold">
              GỢI Ý
            </Text>
            <div className="grid grid-cols-1 gap-1">
              {listUser.length > 0 ? (
                listUser.map(user => (
                  <div
                    key={user.id}
                    className="grid grid-cols-24 hover:bg-gray-100 p-1 rounded-md cursor-pointer transition-colors"
                    onClick={() => onSelectUserTag(user)}
                  >
                    <div className="col-span-3 flex items-center">
                      <Avatar
                        src={user.avatar || defaultAvatar}
                        size={42}
                        className="rounded-full"
                      />
                    </div>
                    <div className="col-span-18 flex items-center">
                      <Text ellipsis strong className="!text-md">
                        {user.name}
                      </Text>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostUserTags;
