import { callApiUploadCloudinary } from '@social/apis/upload.api';
import {
  callApiGetUserInfo,
  callApiUpdateUserCover,
} from '@social/apis/user.api';
import AvatarUser from '@social/components/common/AvatarUser';
import ModalEditProfile from '@social/components/modals/profiles/ModalEditProfile';
import ModalUpdateAvatar from '@social/components/modals/profiles/ModalUpdateAvatar';
import ButtonAddFriend from '@social/components/profiles/ButtonAddFriend';
import { ROUTES } from '@social/constants/route.constant';
import { USER_DEFAULT } from '@social/defaults/user.default';
import { useAppDispatch, useAppSelector } from '@social/hooks/redux.hook';
import { doUpdateCover } from '@social/redux/reducers/auth.reducer';
import { doOpenConversation } from '@social/redux/reducers/conversations.reducer';
import type { IConversation } from '@social/types/conversations.type';
import type { IPreviewImage, IUser } from '@social/types/user.type';
import { Button, message, Tabs, Typography } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { TbCameraFilled, TbEdit, TbMessageCircle } from 'react-icons/tb';
import { useNavigate, useParams } from 'react-router-dom';
import ProfileFriendListTab from './ProfileFriendListTab';
import ProfilePostTag from './ProfilePostTag';

const { Text, Paragraph } = Typography;

const ProfilePage = () => {
  const { userId } = useParams();
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const [friendInfo, setFriendInfo] = useState<IUser>(USER_DEFAULT);
  const [coverPreview, setCoverPreview] = useState<IPreviewImage | null>(null);
  const [isLoadingCover, setIsLoadingCover] = useState(false);
  const [isOpenModalAddAvatar, setIsOpenModalAddAvatar] = useState(false);
  const [isOpenModalAddCover, setIsOpenModalAddCover] = useState(false);
  const [isOpenModalEditInfo, setIsOpenModalEditInfo] = useState(false);
  const [tabActive, setTabActive] = useState('posts');
  const coverInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const items = [
    {
      key: 'posts',
      label: <span className="text-base font-semibold">Bài viết</span>,
    },
    {
      key: 'friends',
      label: <span className="text-base font-semibold">Bạn bè</span>,
    },
  ];

  const fetchUserInfo = useCallback(async () => {
    try {
      if (!userId) return;
      const res = await callApiGetUserInfo(userId);
      if (res.data) {
        setFriendInfo(res.data);
      } else {
        navigate(ROUTES.DEFAULT);
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      message.error('Không tìm thấy người dùng');
      navigate(ROUTES.DEFAULT);
    }
  }, [userId, navigate]);

  useEffect(() => {
    if (userId !== userInfo._id) {
      fetchUserInfo();
    } else {
      setFriendInfo(userInfo);
    }
  }, [userId, fetchUserInfo, userInfo]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const onChangeTab = (key: string) => {
    setTabActive(key);
  };

  const handleOpenConversation = () => {
    const data: IConversation = {
      _id: friendInfo._id,
      users: [
        {
          _id: userInfo._id,
          fullname: userInfo.fullname,
          avatar: userInfo.avatar,
          isOnline: userInfo.isOnline,
        },
        {
          _id: friendInfo._id,
          fullname: friendInfo.fullname,
          avatar: friendInfo.avatar,
          isOnline: friendInfo.isOnline,
        },
      ],
      isGroup: false,
      name: friendInfo.fullname,
      avatar: friendInfo.avatar,
      isExist: false,
      lastActive: friendInfo.lastActive,
      isOnline: friendInfo.isOnline,
      usersState: [],
      lastMessageAt: '',
    };
    dispatch(doOpenConversation(data));
  };

  const onOpenModalAddAvatar = () => {
    setIsOpenModalAddAvatar(true);
  };

  const handleOpenModalEditInfo = () => {
    setIsOpenModalEditInfo(true);
  };

  const handleCancelModalAddCover = () => {
    setIsOpenModalAddCover(false);
    setCoverPreview(null);
  };

  const handleSaveModalAddCover = async () => {
    try {
      setIsLoadingCover(true);
      if (!coverPreview || !coverPreview.file) return;
      const res = await callApiUploadCloudinary(
        coverPreview.file,
        'cover_user'
      );
      if (res.data) {
        const resUpdate = await callApiUpdateUserCover(res.data.fileUpload);
        if (resUpdate.data) {
          message.success('Lưu ảnh bìa thành công');
          dispatch(doUpdateCover(res.data.fileUpload));
          setIsOpenModalAddCover(false);
        } else {
          message.error('Lưu ảnh bìa thất bại');
        }
      } else {
        message.error('Upload file thất bại');
      }
    } catch (error) {
      message.error('Lưu ảnh bìa thất bại');
      console.error(error);
    } finally {
      setIsLoadingCover(false);
    }
  };

  const handleUploadCover = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSizeInBytes = 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      message.error('Kích thước ảnh quá lớn. Vui lòng chọn ảnh nhỏ hơn 1MB.');
      e.target.value = '';
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      const minWidth = 500;
      const minHeight = 100;

      if (img.width < minWidth || img.height < minHeight) {
        message.warning(
          `Kích thước ảnh quá nhỏ. Vui lòng chọn ảnh có kích thước tối thiểu ${minWidth} x ${minHeight}px.`
        );
        e.target.value = '';
        return;
      }

      setCoverPreview({
        url: objectUrl,
        file,
      });
      setIsOpenModalAddCover(true);
    };

    img.src = objectUrl;
  };

  const renderTabContent = () => {
    switch (tabActive) {
      case 'posts':
        return <ProfilePostTag userProfile={friendInfo} />;
      case 'friends':
        return <ProfileFriendListTab />;
      default:
        return (
          <div className="flex items-center justify-center w-full h-full">
            <span className="text-gray-500 text-h2 font-bold">
              Đang phát triển
            </span>
          </div>
        );
    }
  };

  return (
    <>
      <div className="min-h-full bg-gray-50">
        <div className="bg-white shadow-md">
          <div className="">
            <div className="flex justify-center relative">
              {isOpenModalAddCover && (
                <div className="absolute z-1 left-0 top-0 right-0 h-15 bg-black/50">
                  <div className="flex justify-end items-center h-full mx-5 gap-2">
                    <Button
                      color="lime"
                      className="!px-8 !py-2"
                      onClick={handleCancelModalAddCover}
                      disabled={isLoadingCover}
                    >
                      Hủy
                    </Button>
                    <Button
                      type="primary"
                      onClick={handleSaveModalAddCover}
                      className="!px-8 !py-2"
                      loading={isLoadingCover}
                    >
                      Lưu thay đổi
                    </Button>
                  </div>
                </div>
              )}
              <div className="w-full max-w-6xl h-80 bg-gradient-to-b from-gray-200 to-gray-400 rounded-b-2xl relative overflow-hidden">
                {(friendInfo.cover || coverPreview) && (
                  <img
                    src={
                      coverPreview?.url ? coverPreview.url : friendInfo.cover
                    }
                    alt="cover"
                    className="w-full h-full object-cover"
                  />
                )}
                {!isOpenModalAddCover && userId === userInfo._id && (
                  <div className="absolute bottom-2 right-8">
                    <div
                      className="bg-white flex items-center gap-1 p-1.5 rounded-md cursor-pointer hover:bg-gray-100"
                      onClick={() => coverInputRef.current?.click()}
                    >
                      <TbCameraFilled size={20} />
                      <span className="text-base font-semibold hidden md:block">
                        Thêm ảnh bìa
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full max-w-6xl pb-4 px-4">
                <div className="relative flex flex-col md:flex-row items-center">
                  <div className="bottom-0 left-0 md:absolute relative -mt-[84px] md:mt-0">
                    <AvatarUser
                      avatar={friendInfo.avatar}
                      size={174}
                      className="!border-4 !border-white"
                    />
                    {userId === userInfo._id && (
                      <div
                        className="absolute bottom-2 right-2 cursor-pointer"
                        onClick={onOpenModalAddAvatar}
                      >
                        <div className="bg-gray-200 shadow-md size-9 rounded-full flex items-center justify-center">
                          <TbCameraFilled size={24} />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="w-[174px] hidden md:block shrink-0"></div>

                  <div className="md:mt-8 md:mb-4 mb-2 flex-1 ml-2 shrink-0">
                    <span className="font-bold text-h1 text-center !mb-0 block-inline">
                      {friendInfo.fullname || 'Tên người dùng'}
                    </span>
                    <div className="flex gap-2 items-center shrink-0">
                      <Text className="text-gray-600 !text-base">
                        {friendInfo?.followers?.length || 0} người theo dõi
                      </Text>
                      <span className="text-gray-600 !text-base">•</span>
                      <Paragraph className="text-gray-600 !text-base !mb-0">
                        {friendInfo?.following?.length || 0} đang theo dõi
                      </Paragraph>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 flex-1 justify-end">
                    {userId !== userInfo._id && userId && (
                      <ButtonAddFriend userIdB={userId} />
                    )}
                    {userId !== userInfo._id && userId && (
                      <Button type="primary" onClick={handleOpenConversation}>
                        <TbMessageCircle size={20} />
                        <span className="text-base font-semibold">
                          Nhắn tin
                        </span>
                      </Button>
                    )}
                    {userId === userInfo._id && (
                      <div
                        className="p-1.5 flex items-center gap-1 cursor-pointer hover:bg-gray-300 bg-gray-200 rounded-md"
                        onClick={handleOpenModalEditInfo}
                      >
                        <TbEdit size={20} />
                        <span className="text-base font-semibold">
                          Chỉnh sửa
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="flex gap-2 overflow-x-auto w-full max-w-6xl border-t border-gray-300 mx-3 lg:mx-0">
                <Tabs
                  activeKey={tabActive}
                  items={items}
                  onChange={onChangeTab}
                  tabBarStyle={{ margin: 0 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content placeholder */}
        <div className="w-full flex justify-center pb-3">
          <div className="lg:max-w-6xl w-full max-w-2xl mx-4 mt-4">
            {renderTabContent()}
          </div>
        </div>
      </div>
      <ModalUpdateAvatar
        open={isOpenModalAddAvatar}
        onClose={() => setIsOpenModalAddAvatar(false)}
        avatar={userInfo.avatar}
      />
      <ModalEditProfile
        open={isOpenModalEditInfo}
        onClose={() => setIsOpenModalEditInfo(false)}
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleUploadCover}
        hidden
        ref={coverInputRef}
      />
    </>
  );
};

export default ProfilePage;
