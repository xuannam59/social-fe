import { callApiAddMemberToConversation } from '@social/apis/conversations.api';
import { callApiFetchUserFriendList } from '@social/apis/user.api';
import { convertSlug } from '@social/common/convert';
import AvatarUser from '@social/components/common/AvatarUser';
import { useAppDispatch } from '@social/hooks/redux.hook';
import { doAddMemberToConversation } from '@social/redux/reducers/conversations.reducer';
import type { IConversation } from '@social/types/conversations.type';
import type { IUserTag } from '@social/types/user.type';
import { Button, Checkbox, Input, message, Modal } from 'antd';
import { debounce } from 'lodash';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
} from 'react';
import { TbLoader2, TbSearch, TbX } from 'react-icons/tb';

interface IProps {
  open: boolean;
  onClose: () => void;
  conversation: IConversation;
}

const ModalConversationAddMember: React.FC<IProps> = ({
  open,
  onClose,
  conversation,
}) => {
  const dispatch = useAppDispatch();
  const [listFriend, setListFriend] = useState<IUserTag[]>([]);
  const [isLoadingFriend, setIsLoadingFriend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<IUserTag[]>([]);
  const userIdList = useMemo(() => {
    return conversation.users.map(user => user._id);
  }, [conversation.users]);

  const fetchUserFriendList = useCallback(async () => {
    try {
      setIsLoadingFriend(true);
      let query = `limit=10`;
      if (userIdList.length > 0) {
        query += `&exclude=${userIdList.join(',')}`;
      }
      const res = await callApiFetchUserFriendList(query);
      if (res.data) {
        setListFriend(res.data.friends);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingFriend(false);
    }
  }, [userIdList]);

  useEffect(() => {
    fetchUserFriendList();
  }, [fetchUserFriendList]);

  const debouncedFetch = useMemo(
    () =>
      debounce(async (value: string) => {
        try {
          setIsLoadingFriend(true);
          const slug = convertSlug(value);
          let query = `limit=10${slug ? `&search=${slug}` : ''}`;
          if (userIdList.length > 0) {
            query += `&exclude=${userIdList.join(',')}`;
          }
          const res = await callApiFetchUserFriendList(query);
          if (res.data) {
            setListFriend(res.data.friends);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoadingFriend(false);
        }
      }, 500),
    [userIdList]
  );

  useEffect(() => {
    return () => {
      debouncedFetch.cancel();
    };
  }, [debouncedFetch]);

  const handleSelectUser = useCallback(
    (user: IUserTag) => {
      if (selectedUsers.some(item => item._id === user._id)) {
        setSelectedUsers(prev => prev.filter(item => item._id !== user._id));
      } else {
        setSelectedUsers(prev => [...prev, user]);
      }
    },
    [selectedUsers]
  );

  const handleSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      debouncedFetch(value);
    },
    [debouncedFetch]
  );

  const handleRemoveUser = useCallback((user: IUserTag) => {
    setSelectedUsers(prev => prev.filter(item => item._id !== user._id));
  }, []);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const data = {
        userIds: selectedUsers.map(user => user._id),
        conversationId: conversation._id,
      };
      const res = await callApiAddMemberToConversation(data);
      if (res.data) {
        message.success('Thêm thành viên thành công');
        dispatch(
          doAddMemberToConversation({
            conversationId: conversation._id,
            users: selectedUsers,
          })
        );
        onClose();
      } else {
        message.error(res.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Modal
        open={open}
        footer={null}
        closable={false}
        maskClosable={false}
        centered
        title={false}
        destroyOnHidden={true}
        className="create-post-modal"
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex justify-center flex-1">
              <span className="text-h3 font-bold">Thêm thành viên</span>
            </div>
            <Button
              type="text"
              shape="circle"
              onClick={onClose}
              disabled={isLoading}
            >
              <TbX size={20} />
            </Button>
          </div>
          <div className="px-4 mb-3 flex items-center">
            <Input
              placeholder="Tìm kiếm thành viên"
              allowClear
              prefix={<TbSearch size={20} className="text-gray-500" />}
              variant="filled"
              className="!rounded-full !border-none !bg-gray-100"
              onChange={handleSearch}
            />
          </div>
          <div className="h-25 px-8 mb-2">
            {selectedUsers.length > 0 ? (
              <div className="flex gap-2 overflow-x-auto overflow-y-hidden h-full">
                {selectedUsers.map(user => (
                  <div
                    key={user._id}
                    className="flex flex-col items-center w-[80px] relative flex-shrink-0"
                  >
                    <div className="h-[50%]">
                      <AvatarUser avatar={user.avatar} size={42} />
                    </div>
                    <div className="text-sm text-center text-gray-500 break-warp line-clamp-2">
                      {user.fullname}
                    </div>
                    <div className="absolute top-0 right-3">
                      <div
                        className="bg-white rounded-full p-0.5 shadow-lg border border-gray-200 cursor-pointer"
                        onClick={() => handleRemoveUser(user)}
                      >
                        <TbX size={14} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-base text-gray-500">
                  Chưa chọn thành viên nào
                </span>
              </div>
            )}
          </div>
          <div className="h-[200px]">
            <div className="max-h-[200px] overflow-y-auto overflow-x-hidden px-4">
              <span className="text-h3 font-medium mb-1.5">Bạn bè</span>
              {isLoadingFriend ? (
                <div className="flex items-center justify-center h-full">
                  <TbLoader2 size={25} className="animate-spin" />
                </div>
              ) : listFriend.length > 0 ? (
                <div className="flex flex-col overflow-x-auto overflow-y-hidden h-full px-2">
                  {listFriend.map(user => (
                    <div
                      className="flex justify-between hover:bg-gray-100 p-2 rounded-md cursor-pointer"
                      key={user._id}
                      onClick={() => handleSelectUser(user)}
                    >
                      <div className="flex items-center gap-2">
                        <AvatarUser avatar={user.avatar} size={42} />
                        <span className="text-base font-medium line-clamp-1">
                          {user.fullname}
                        </span>
                      </div>
                      <Checkbox
                        checked={selectedUsers.some(
                          item => item._id === user._id
                        )}
                        className="!rounded-full"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-base text-gray-500">
                    Không có bạn bè
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end px-4 py-2">
            <Button
              type="primary"
              onClick={handleSubmit}
              className="w-full"
              loading={isLoading}
            >
              Thêm thành viên
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalConversationAddMember;
