import { CloseOutlined } from '@ant-design/icons';
import ImageGallery from '@social/components/post/ImageGallery';
import { useAppSelector } from '@social/hooks/redux.hook';
import defaultAvatar from '@social/images/default-avatar.webp';
import type { IFormCreatePost } from '@social/types/post.type';
import { Avatar, Button, Form, Input, Modal, Select } from 'antd';
import EmojiPicker, {
  EmojiStyle,
  type EmojiClickData,
} from 'emoji-picker-react';
import { useRef, useState } from 'react';
import { LiaUserTagSolid } from 'react-icons/lia';
import {
  TbLock,
  TbMoodSmileBeam,
  TbPhoto,
  TbUsers,
  TbWorld,
} from 'react-icons/tb';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalCreatePost: React.FC<IProps> = ({ isOpen, onClose }) => {
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [image, setImage] = useState<
    {
      url: string;
      file: File;
    }[]
  >([]);
  const [form] = Form.useForm();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCancel = () => {
    onClose();
    setShowEmojiPicker(false);
    form.resetFields();
  };

  const handleSubmit = (values: any) => {
    const data: IFormCreatePost = {
      content: values.content,
      privacy: values.privacy,
      images: image.map(item => item.file),
    };
    console.log(data);
  };

  const onEmojiClick = (emojiObject: EmojiClickData) => {
    const { emoji } = emojiObject;
    form.setFieldsValue({ content: form.getFieldValue('content') + emoji });
    form.focusField('content');
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileUrls = Array.from(files).map(file => ({
        url: URL.createObjectURL(file),
        file,
      }));
      setImage(prev => [...prev, ...fileUrls]);
    }
  };

  const privacyOptions = [
    {
      label: (
        <div className="flex items-center gap-2">
          <TbWorld size={16} />
          <span>Public</span>
        </div>
      ),
      value: 'public',
    },
    {
      label: (
        <div className="flex items-center gap-2">
          <TbUsers size={16} />
          <span>Friends</span>
        </div>
      ),
      value: 'friends',
    },
    {
      label: (
        <div className="flex items-center gap-2">
          <TbLock size={16} />
          <span>Only me</span>
        </div>
      ),
      value: 'only-me',
    },
  ];

  return (
    <>
      <Modal
        open={isOpen}
        onCancel={handleCancel}
        className="create-post-modal"
        footer={null}
        closable={false}
        maskClosable={false}
        title={
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-center flex-1">
              Create Post
            </h2>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={handleCancel}
            />
          </div>
        }
      >
        {/* User Profile & Privacy */}

        <div className="px-3">
          <Form
            form={form}
            onFinish={handleSubmit}
            initialValues={{
              content: '',
              privacy: 'public',
            }}
          >
            <div className="grid grid-cols-1">
              <div className="flex items-center gap-3">
                <Avatar
                  size={50}
                  src={userInfo?.avatar || defaultAvatar}
                  className="flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">
                    {userInfo?.fullname || 'Nam Minh'}
                  </div>
                  <div className="flex items-center gap-2">
                    <Form.Item name="privacy" className="!mb-0">
                      <Select
                        size="small"
                        options={privacyOptions}
                        variant="filled"
                        className="!w-30"
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
              <div className="overflow-x-hidden overflow-y-auto flex flex-col gap-3 max-h-[calc(100vh-400px)]">
                <div className="flex flex-col gap-2">
                  <div className="relative">
                    <Form.Item
                      name="content"
                      dependencies={['content']}
                      className="!mb-0"
                    >
                      <Input.TextArea
                        placeholder="What's on your mind?"
                        className="!border-none !resize-none !text-md min-h-[120px]"
                        autoSize={{ minRows: image.length > 0 ? 2 : 5 }}
                      />
                    </Form.Item>

                    <div className="absolute bottom-1 right-1">
                      <Button
                        size="large"
                        type="text"
                        shape="circle"
                        onClick={() => {
                          setShowEmojiPicker(!showEmojiPicker);
                          form.focusField('content');
                        }}
                      >
                        <TbMoodSmileBeam size={24} />
                      </Button>
                    </div>
                  </div>
                </div>
                {image && image.length > 0 && (
                  <ImageGallery images={image} onDelete={() => setImage([])} />
                )}
              </div>

              <div className="relative">
                <div
                  className={`absolute bottom-10 right-0 mb-2 z-50 ${
                    showEmojiPicker ? 'block' : 'hidden'
                  }`}
                >
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowEmojiPicker(false)}
                  />

                  <div className="relative z-50">
                    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
                      <EmojiPicker
                        onEmojiClick={onEmojiClick}
                        width={300}
                        height={250}
                        previewConfig={{ showPreview: false }}
                        searchDisabled={true}
                        emojiStyle={EmojiStyle.FACEBOOK}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-2">
                <div className="flex items-center justify-between gap-2">
                  <span>Add to your article</span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Button
                        type="text"
                        shape="circle"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <TbPhoto size={24} className="text-lime-700" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="text"
                        shape="circle"
                        onClick={() => {
                          console.log('click');
                        }}
                      >
                        <LiaUserTagSolid size={24} className="text-primary" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="py-4">
                <Button
                  type="primary"
                  onClick={() => form.submit()}
                  className="w-full"
                >
                  Post
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </Modal>
      <input
        className="hidden"
        type="file"
        id="upload"
        multiple
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileSelect}
      />
    </>
  );
};

export default ModalCreatePost;
