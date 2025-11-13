import { callApiCreateConversation } from '@social/apis/conversations.api';
import { callApiUploadCloudinary } from '@social/apis/upload.api';
import { callApiFetchUserFriendList } from '@social/apis/user.api';
import { convertSlug } from '@social/common/convert';
import AvatarUser from '@social/components/common/AvatarUser';
import type { ICreateConversation } from '@social/types/conversations.type';
import type { IUserTag } from '@social/types/user.type';
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Upload,
  type GetProp,
  type UploadFile,
  type UploadProps,
} from 'antd';
import { debounce } from 'lodash';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
} from 'react';
import { TbLoader2, TbPhotoPlus, TbX } from 'react-icons/tb';
import { useAppDispatch, useAppSelector } from '@social/hooks/redux.hook';
import { doCreateConversation } from '@social/redux/reducers/conversations.reducer';

interface IProps {
  open: boolean;
  onClose: () => void;
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const ModalCreateConversation: React.FC<IProps> = ({ open, onClose }) => {
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const [avatar, setAvatar] = useState<UploadFile | null>(null);
  const [isLoadingFriend, setIsLoadingFriend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [listFriend, setListFriend] = useState<IUserTag[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<IUserTag[]>([]);
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const fetchUserFriendList = useCallback(async () => {
    try {
      setIsLoadingFriend(true);
      const res = await callApiFetchUserFriendList('limit=10');
      if (res.data) {
        setListFriend(res.data.friends);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingFriend(false);
    }
  }, []);

  useEffect(() => {
    fetchUserFriendList();
  }, [fetchUserFriendList]);

  const debouncedFetch = useMemo(
    () =>
      debounce(async (value: string) => {
        try {
          setIsLoadingFriend(true);
          const slug = convertSlug(value);
          const query = `limit=10${slug ? `&search=${slug}` : ''}
            ${selectedUsers.length > 0 ? `&exclude=${selectedUsers.map(user => user._id)}` : ''}`;
          const res = await callApiFetchUserFriendList(query);
          if (res.data) {
            setListFriend(res.data.friends);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoadingFriend(false);
        }
      }, 1000),
    [selectedUsers]
  );

  useEffect(() => {
    return () => {
      debouncedFetch.cancel();
    };
  }, [debouncedFetch]);

  const handleCancel = () => {
    onClose();
    setAvatar(null);
    setSelectedUsers([]);
    setListFriend(prev => [...prev, ...selectedUsers]);
    form.resetFields();
  };

  const handleUploadChange: UploadProps['onChange'] = info => {
    const file = info.file;
    if (file.status === 'removed') {
      setAvatar(null);
      return;
    }
    if (file) {
      setAvatar({
        uid: file.uid,
        originFileObj: file.originFileObj,
        name: file.name,
        url: URL.createObjectURL(file.originFileObj as Blob),
        status: 'done',
      });
    }
  };

  const beforeUpload = (file: FileType) => {
    const isImage = file.type.startsWith('image/');
    const mb = 1024 * 1024;
    if (!isImage) {
      message.error('Bạn chỉ có thể tải lên ảnh');
      return Upload.LIST_IGNORE;
    }
    if (file.size > mb) {
      message.error(`Ảnh không được lớn hơn 1MB`);
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const onFinish = async (values: any) => {
    const { name } = values;
    try {
      if (selectedUsers.length < 2) {
        message.error('Vui lòng chọn ít nhất 2 người');
        return;
      }
      setIsLoading(true);
      let avatarLink = '';
      if (avatar && avatar.originFileObj) {
        const res = await callApiUploadCloudinary(
          avatar.originFileObj,
          'avatar_conversation'
        );
        if (res.data) {
          avatarLink = res.data.fileUpload;
        } else {
          message.error(res.message);
          return;
        }
      }
      const data: ICreateConversation = {
        name,
        avatar: avatarLink,
        userIds: selectedUsers.map(user => user._id),
      };
      const res = await callApiCreateConversation(data);
      if (res.data) {
        message.success('Tạo nhóm chat thành công');
        dispatch(
          doCreateConversation({
            ...res.data,
            users: [
              {
                _id: userInfo._id,
                fullname: userInfo.fullname,
                avatar: userInfo.avatar,
                isOnline: userInfo.isOnline,
              },
              ...selectedUsers.map(user => ({
                _id: user._id,
                fullname: user.fullname,
                avatar: user.avatar,
                isOnline: false,
              })),
            ],
          })
        );
        handleCancel();
      } else {
        message.error(res.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      debouncedFetch(value);
    },
    [debouncedFetch]
  );

  const handleSelectUser = useCallback((user: IUserTag) => {
    setSelectedUsers(prev => [...prev, user]);
    setListFriend(prev => prev.filter(item => item._id !== user._id));
  }, []);

  const handleRemoveUser = useCallback((user: IUserTag) => {
    setSelectedUsers(prev => prev.filter(item => item._id !== user._id));
    setListFriend(prev => [user, ...prev]);
  }, []);

  return (
    <>
      <Modal
        open={open}
        footer={null}
        closable={false}
        maskClosable={false}
        title={false}
        destroyOnHidden={true}
        className="create-post-modal"
      >
        <div className="max-h-[calc(100vh-100px)]">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex-1 flex items-center justify-center">
              <span className="text-h3 font-bold">Tạo nhóm chat</span>
            </div>
            <Button type="text" shape="circle" onClick={handleCancel}>
              <TbX size={20} />
            </Button>
          </div>
          <div className="p-3 max-h-[calc(100vh-300px)] overflow-y-auto overflow-x-hidden">
            <Form
              form={form}
              onFinish={onFinish}
              layout="vertical"
              disabled={isLoading}
            >
              <div className="flex flex-col items-center mb-2">
                <div className="text-base mb-2">Ảnh đại diện nhóm</div>
                <Upload
                  accept="image/*"
                  multiple={false}
                  listType="picture-circle"
                  onChange={handleUploadChange}
                  fileList={avatar ? [avatar] : []}
                  beforeUpload={beforeUpload}
                >
                  {avatar ? null : <TbPhotoPlus size={20} />}
                </Upload>

                <span className="text-sm">Kéo thả hoặc bấm để chọn ảnh</span>
                <span className="text-xs text-gray-500">
                  PNG/JPG/WebP · &lt; 1MB
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Form.Item
                    name="name"
                    label="Tên nhóm"
                    rules={[
                      { required: true, message: 'Vui lòng nhập tên nhóm' },
                    ]}
                    className="!mb-2"
                  >
                    <Input placeholder="Nhập tên nhóm" allowClear />
                  </Form.Item>
                </div>
                <div className="flex-1">
                  <Form.Item label="Tim bạn bè" className="!mb-2">
                    <Input
                      placeholder="Tìm bạn bè"
                      onChange={handleSearch}
                      allowClear
                    />
                  </Form.Item>
                </div>
              </div>
              <div className="h-25 mb-2">
                {selectedUsers.length > 0 ? (
                  <div className="flex gap-2 overflow-x-auto overflow-y-hidden h-full px-8">
                    {selectedUsers.map(user => (
                      <div
                        key={user._id}
                        className="flex flex-col items-center w-[80px] relative flex-shrink-0"
                      >
                        <div className="h-[60%]">
                          <AvatarUser avatar={user.avatar} size={42} />
                        </div>
                        <div className="h-[40%]">
                          <div className="text-sm text-center text-gray-500 break-warp line-clamp-2">
                            {user.fullname}
                          </div>
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
              <div className="flex-1 max-h-[200px] overflow-y-auto overflow-x-hidden">
                <div className="mb-1">
                  <span className="text-h4 font-medium">Bạn bè</span>
                </div>
                {isLoadingFriend ? (
                  <div className="flex items-center justify-center h-[40px]">
                    <TbLoader2 size={25} className="animate-spin" />
                  </div>
                ) : listFriend.length > 0 ? (
                  <div className="grid grid-cols-1">
                    {listFriend.map(user => (
                      <div key={user._id} className="col-span-1">
                        <div
                          className="p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleSelectUser(user)}
                        >
                          <div className="flex items-center gap-2">
                            <div className="flex-shrink-0">
                              <AvatarUser avatar={user.avatar} size={42} />
                            </div>
                            <span className="text-base">{user.fullname}</span>
                          </div>
                        </div>
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
            </Form>
          </div>
          <div className="flex justify-end p-4 border-t border-gray-200">
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => form.submit()}
              loading={isLoading}
              className="w-full"
            >
              Tạo nhóm
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalCreateConversation;
