import {
  Button,
  Input,
  Form,
  Modal,
  Upload,
  type UploadFile,
  type UploadProps,
  message,
  type GetProp,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { TbPhotoPlus, TbX } from 'react-icons/tb';
import type {
  IConversation,
  IEditConversation,
} from '@social/types/conversations.type';
import { callApiUploadCloudinary } from '@social/apis/upload.api';
import { callApiEditConversation } from '@social/apis/conversations.api';
import { doEditConversation } from '@social/redux/reducers/conversations.reducer';
import { useAppDispatch } from '@social/hooks/redux.hook';
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

interface IProps {
  open: boolean;
  onClose: () => void;
  conversation: IConversation;
}

const ModalEditConversation: React.FC<IProps> = ({
  open,
  onClose,
  conversation,
}) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [avatar, setAvatar] = useState<UploadFile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
      message.error('Ảnh không được lớn hơn 1MB');
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const onFinish = async (values: any) => {
    try {
      setIsLoading(true);
      let avatarLink = conversation.avatar || '';
      if (avatar && avatar.originFileObj) {
        const res = await callApiUploadCloudinary(
          avatar.originFileObj,
          'avatar_conversation'
        );
        if (res.data) {
          avatarLink = res.data.fileUpload;
        }
      } else if (!avatar) {
        avatarLink = '';
      }
      const data: IEditConversation = {
        name: values.name.trim(),
        avatar: avatarLink,
        conversationId: conversation._id,
      };
      const res = await callApiEditConversation(data);
      if (res.data) {
        message.success('Cập nhập nhóm thành công');
        dispatch(doEditConversation(data));
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

  useEffect(() => {
    form.setFieldsValue({
      name: conversation.name || '',
    });
    if (conversation.avatar) {
      setAvatar({
        uid: conversation._id,
        name: conversation.name || '',
        url: conversation.avatar || '',
        status: 'done',
      });
    }
  }, [conversation, form]);

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
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex-1 flex items-center justify-center">
              <span className="text-h3 font-bold">Chỉnh sửa nhóm</span>
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
          <div className="p-4">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              disabled={isLoading}
            >
              <div className="flex flex-col items-center">
                <span className="text-base mb-2">Ảnh đại diện nhóm</span>
                <Upload
                  accept="image/*"
                  multiple={false}
                  listType="picture-circle"
                  onChange={handleUploadChange}
                  fileList={avatar ? [avatar] : []}
                  beforeUpload={beforeUpload}
                  disabled={isLoading}
                >
                  {avatar ? null : <TbPhotoPlus size={20} />}
                </Upload>
                <span className="text-sm">Kéo thả hoặc bấm để chọn ảnh</span>
                <span className="text-xs text-gray-500">
                  PNG/JPG/WebP · &lt; 1MB
                </span>
              </div>
              <Form.Item label="Tên nhóm" name="name">
                <Input placeholder="Nhập tên nhóm" allowClear />
              </Form.Item>
            </Form>
          </div>
          <div className="flex justify-end px-4 py-2">
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => form.submit()}
              className="w-full"
              loading={isLoading}
            >
              Cập nhập
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalEditConversation;
