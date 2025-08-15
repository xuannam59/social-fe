import { useAppSelector } from '@social/hooks/redux.hook';
import defaultAvatar from '@social/images/default-avatar.webp';
import { Button } from 'antd';
import { useCallback, useRef, useState } from 'react';
import { FcAddImage, FcVideoCall } from 'react-icons/fc';
import ModalCreatePost from '../modals/posts/ModalCreatePost';
import { Link } from 'react-router-dom';
import type { IFile } from '@social/types/post.type';
import { convertToFile } from '@social/common/convert';

const CreatePost = () => {
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<IFile[]>([]);
  const [video, setVideo] = useState<IFile[]>([]);

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      const fileUrls = convertToFile(files);
      setImage(prev => [...prev, ...fileUrls]);
      event.target.value = '';
    },
    []
  );

  const handleVideoSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      const fileUrls = convertToFile(files);
      setVideo(prev => [...prev, ...fileUrls]);
      event.target.value = '';
    },
    []
  );

  const onOpenChooseFile = useCallback((type: 'image' | 'video') => {
    if (type === 'image') {
      imageInputRef.current?.click();
    } else {
      videoInputRef.current?.click();
    }
  }, []);

  const onDeleteFile = useCallback((type: 'image' | 'video') => {
    if (type === 'image') {
      setImage([]);
    } else {
      setVideo([]);
    }
  }, []);

  return (
    <>
      <div className="w-full rounded-lg bg-white p-3">
        <div className="flex flex-col gap-2">
          <div className="flex gap-4">
            <Link to={`/profile/${userInfo?._id}`}>
              <img
                className="w-10 rounded-full object-cover"
                src={userInfo?.avatar || defaultAvatar}
                alt="avatar"
              />
            </Link>

            <div
              className="border-none bg-gray-100 rounded-full cursor-pointer flex items-center justify-start p-2 flex-1
               hover:bg-gray-200"
              onClick={() => setIsModalOpen(true)}
            >
              <span className="text-md text-gray-500">
                {userInfo?.fullname || 'bạn'} ơi, bạn đang nghĩ gì?
              </span>
            </div>
          </div>
          <div className="grid grid-cols-6 border-t border-gray-200 pt-2 gap-2">
            <Button
              size="large"
              className="col-span-2 col-start-2 flex gap-2 items-center justify-center"
              type="text"
              onClick={() => onOpenChooseFile('image')}
            >
              <FcAddImage size={24} />
              <span className="text-md">Images</span>
            </Button>
            <Button
              size="large"
              className="col-span-2 flex gap-2 items-center justify-center"
              type="text"
              onClick={() => onOpenChooseFile('video')}
            >
              <FcVideoCall size={24} />
              <span className="text-md">Videos</span>
            </Button>
          </div>
        </div>
      </div>

      <input
        className="hidden"
        type="file"
        id="image-upload"
        multiple
        accept="image/*"
        ref={imageInputRef}
        onChange={e => {
          handleFileSelect(e);
          setIsModalOpen(true);
        }}
      />
      <input
        className="hidden"
        type="file"
        id="video-upload"
        multiple
        accept="video/*"
        ref={videoInputRef}
        onChange={e => {
          handleVideoSelect(e);
          setIsModalOpen(true);
        }}
      />

      <ModalCreatePost
        isOpen={isModalOpen}
        image={image}
        video={video}
        onClose={handleCancel}
        onOpenChooseFile={onOpenChooseFile}
        onDeleteFile={onDeleteFile}
      />
    </>
  );
};

export default CreatePost;
