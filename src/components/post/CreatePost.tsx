import { useAppSelector } from '@social/hooks/redux.hook';
import defaultAvatar from '@social/images/default-avatar.webp';
import { Button, Input } from 'antd';
import { useState } from 'react';
import { FcAddImage, FcVideoCall } from 'react-icons/fc';
import ModalCreatePost from '../modals/ModalCreatePost';

const CreatePost = () => {
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="w-full rounded-lg bg-white p-3">
        <div className="flex flex-col gap-2">
          <div className="flex gap-4">
            <img
              className="w-10 rounded-full object-cover"
              src={userInfo?.avatar || defaultAvatar}
              alt="avatar"
            />
            <Input
              placeholder={`What's you think ${userInfo?.fullname || 'User'}?`}
              className="!border-none !bg-gray-100 !rounded-full cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            />
          </div>
          <div className="grid grid-cols-6 border-t border-gray-200 pt-2 gap-2">
            <Button
              size="large"
              className="col-span-2 col-start-2 flex gap-2 items-center justify-center"
              type="text"
            >
              <FcAddImage size={24} />
              <span className="text-md">Images</span>
            </Button>
            <Button
              size="large"
              className="col-span-2 flex gap-2 items-center justify-center"
              type="text"
            >
              <FcVideoCall size={24} />
              <span className="text-md">Videos</span>
            </Button>
          </div>
        </div>
      </div>

      <ModalCreatePost isOpen={isModalOpen} onClose={handleCancel} />
    </>
  );
};

export default CreatePost;
