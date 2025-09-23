import InputSearch from '@social/components/common/InputSearch';
import EmptyState from '@social/components/common/EmptyState';
import defaultAvatar from '@social/images/default-avatar.webp';
import type { IUserTag } from '@social/types/user.type';
import { Avatar, Button, Modal, Typography } from 'antd';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
} from 'react';
import { TbArrowLeft, TbX } from 'react-icons/tb';
import { callApiFetchUserFriendList } from '@social/apis/user.api';
import Loading from '@social/components/loading/Loading';
import { debounce } from 'lodash';
import { formatSlug } from '@social/common/convert';

interface IProps {
  onBack: () => void;
  addUserTag: (user: IUserTag[]) => void;
  userTags: IUserTag[];
}

const { Text } = Typography;

const PostUserTags: React.FC<IProps> = ({ onBack, addUserTag, userTags }) => {
  const [selectedUser, setSelectedUser] = useState<IUserTag[]>(userTags);
  const [isLoading, setIsLoading] = useState(false);
  const [listUser, setListUser] = useState<IUserTag[]>([]);
  const [total, setTotal] = useState(0);

  const fetchUserFriendList = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await callApiFetchUserFriendList('limit=10');
      if (res.data) {
        const users: IUserTag[] = res.data.friends.map(user => ({
          _id: user._id,
          fullname: user.fullname,
          avatar: user.avatar,
        }));

        setListUser(users);
        setTotal(res.data.total);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const onSelectUserTag = useCallback((user: IUserTag) => {
    setSelectedUser(prev => [...prev, user]);
    setListUser(prev => prev.filter(item => item._id !== user._id));
  }, []);

  const onRemoveUserTag = useCallback((user: IUserTag) => {
    setSelectedUser(prev => prev.filter(item => item._id !== user._id));
    setListUser(prev => [...prev, user]);
  }, []);

  const handleDone = useCallback(() => {
    addUserTag(selectedUser);
    onBack();
  }, [selectedUser, addUserTag, onBack]);

  const handleCancel = useCallback(() => {
    setListUser(prev => [...prev, ...selectedUser]);
    onBack();
    addUserTag([]);
    setSelectedUser([]);
  }, [onBack, addUserTag, selectedUser]);

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

  useEffect(() => {
    fetchUserFriendList();
  }, [fetchUserFriendList]);

  const debouncedSearch = useMemo(
    () =>
      debounce(async (value: string) => {
        setIsLoading(true);
        try {
          const slug = formatSlug(value);
          const query = `limit=10${slug ? `&search=${slug}` : ''}`;
          const res = await callApiFetchUserFriendList(query);
          if (res.data) {
            const users: IUserTag[] = res.data.friends.map(user => ({
              _id: user._id,
              fullname: user.fullname,
              avatar: user.avatar,
            }));
            setListUser(users);
            setTotal(res.data.total);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      }, 1000),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

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
          <InputSearch placeholder="Tìm kiếm" onChange={handleSearch} />
          <Button type="link" onClick={handleDone}>
            Xong
          </Button>
        </div>

        <div className="flex-1 max-h-[60vh] overflow-y-auto overflow-x-hidden">
          {selectedUser && selectedUser.length > 0 && (
            <div className="mb-2 flex-shrink-0">
              <Text
                type="secondary"
                className="block mb-2 !text-md font-semibold"
              >
                ĐÃ GẮN THẺ
              </Text>
              <div className="flex flex-wrap gap-1 border border-gray-200 rounded-md p-1.5">
                {selectedUser.map(user => (
                  <div
                    key={user._id}
                    className="flex items-center py-1 px-2 justify-between bg-primary/10 text-primary rounded-md w-fit"
                  >
                    <div className="mr-2">{user.fullname}</div>
                    <Button
                      type="text"
                      shape="circle"
                      size="small"
                      onClick={() => onRemoveUserTag(user)}
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
            {isLoading ? (
              <Loading />
            ) : (
              <div className="grid grid-cols-1 gap-1">
                {listUser.length > 0 ? (
                  listUser.map(user => (
                    <div
                      key={user._id}
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
                          {user.fullname}
                        </Text>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PostUserTags;
