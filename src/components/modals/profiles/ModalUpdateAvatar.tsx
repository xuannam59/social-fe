import { callApiUploadCloudinary } from '@social/apis/upload.api';
import { callApiUpdateUserAvatar } from '@social/apis/user.api';
import { useAppDispatch } from '@social/hooks/redux.hook';
import { doUpdateAvatar } from '@social/redux/reducers/auth.reducer';
import { Button, message, Modal, Tooltip } from 'antd';
import React, { useRef, useState } from 'react';
import { TbFileIsr, TbPhotoPlus, TbX } from 'react-icons/tb';
import AvatarUser from '../../common/AvatarUser';
import type { IPreviewImage } from '@social/types/user.type';

interface IProps {
  open: boolean;
  onClose: () => void;
  avatar: string;
}

const ModalUpdateAvatar = ({ open, onClose, avatar }: IProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<IPreviewImage>({
    url: avatar,
    file: undefined,
  });
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const onSaveAvatar = async () => {
    const file = avatarPreview.file;
    if (!file) return;
    try {
      setIsLoading(true);
      const res = await callApiUploadCloudinary(file, 'avatar_user');
      if (res.data) {
        const resUpdate = await callApiUpdateUserAvatar(res.data.fileUpload);
        if (resUpdate.data) {
          dispatch(doUpdateAvatar(res.data.fileUpload));
          message.success('Lưu ảnh đại diện thành công');
          onClose();
        } else {
          message.error(resUpdate.message);
        }
      } else {
        message.error(res.message);
      }
    } catch (error) {
      console.error('Failed to save avatar:', error);
      message.error('Lưu ảnh đại diện thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarPreview({
        url: URL.createObjectURL(file),
        file,
      });
    }
  };

  const handleClose = () => {
    setAvatarPreview({
      url: avatar,
      file: undefined,
    });
    onClose();
  };
  return (
    <>
      <Modal
        open={open}
        footer={null}
        title={null}
        closable={false}
        destroyOnHidden={true}
        className="create-post-modal"
        centered
      >
        <div className="max-h-[500px] overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
            <span className="text-h3 font-bold text-center flex-1">
              Thêm ảnh đại diện
            </span>
            <Button type="text" shape="circle" onClick={handleClose}>
              <TbX size={20} />
            </Button>
          </div>
          <div className="flex flex-col gap-2 p-4">
            <div className="h-50 flex justify-center items-center">
              <Tooltip title="Thay ảnh đại diện">
                {avatarPreview.url ? (
                  <AvatarUser
                    avatar={avatarPreview.url}
                    size={142}
                    className={`rounded-full ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    onClick={() => {
                      if (isLoading) return;
                      avatarInputRef.current?.click();
                    }}
                  />
                ) : (
                  <div
                    className={`size-35 rounded-full outline-dashed flex items-center justify-center 
                      ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    onClick={() => {
                      if (isLoading) return;
                      avatarInputRef.current?.click();
                    }}
                  >
                    <TbPhotoPlus size={20} />
                  </div>
                )}
              </Tooltip>
            </div>
            <div className="flex justify-center items-center">
              <Button
                type="primary"
                disabled={!avatarPreview.file}
                onClick={onSaveAvatar}
                loading={isLoading}
              >
                <TbFileIsr size={20} />
                <span className="text-base font-medium">Lưu ảnh</span>
              </Button>
            </div>
          </div>
        </div>
      </Modal>
      <input
        type="file"
        id="avatar-upload"
        className="hidden"
        onChange={handleUploadAvatar}
        accept="image/*"
        ref={avatarInputRef}
        multiple={false}
      />
    </>
  );
};

export default ModalUpdateAvatar;
