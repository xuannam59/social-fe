import { Button, Form, Modal, Radio, Typography } from 'antd';
import React, { useEffect, useMemo } from 'react';
import { TbLock, TbUsers, TbWorld, TbX } from 'react-icons/tb';
import PrivacyItem from '@social/components/common/PrivacyItem';
import TextGradient from '@social/components/common/TextGradient';
import ButtonGradient from '@social/components/common/ButtonGradient';

interface IProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (privacy: string) => void;
  privacy: string;
}

const { Title, Paragraph, Text } = Typography;

const ModalPrivacy: React.FC<IProps> = ({
  open,
  onClose,
  onSubmit,
  privacy,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({ privacy: privacy });
    console.log('privacy', privacy);
  }, [privacy, form]);

  const objectPrivacy = useMemo(
    () => [
      {
        icon: <TbWorld size={30} />,
        title: 'Công khai',
        description: 'Bất kỳ ai cũng có thể xem tin của bạn',
        value: 'public',
      },

      {
        icon: <TbUsers size={30} />,
        title: 'Bạn bè',
        description: 'Chỉ bạn bè của bạn mới có thể xem tin của bạn',
        value: 'friends',
      },
      {
        icon: <TbLock size={30} />,
        title: 'Chỉ mình tôi',
        description: 'Chỉ bạn mới có thể xem tin của bạn',
        value: 'only_me',
      },
    ],
    []
  );

  const onFinish = (values: any) => {
    onSubmit(values.privacy);
    onCancel();
  };

  const onCancel = () => {
    form.setFieldValue('privacy', privacy);
    onClose();
  };

  return (
    <>
      <Modal
        open={open}
        onCancel={onCancel}
        footer={null}
        title={null}
        centered
        className="create-post-modal"
        closable={false}
        destroyOnHidden
      >
        <div className="max-h-[85vh] overflow-y-auto">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-xl font-bold text-center flex-1">
                Tạo bài viết
              </h2>
              <Button type="text" shape="circle" onClick={onCancel}>
                <TbX size={20} />
              </Button>
            </div>
            <div className="flex flex-col gap-2 ">
              <div className="mx-4">
                <Title level={5} className="!mb-0">
                  Ai có thể xem tin của bạn?
                </Title>
                <Text type="secondary">
                  Tin của bạn sẽ hiển thị trên Facebook và Messenger trong 24
                  giờ.
                </Text>
              </div>
              <Form form={form} onFinish={onFinish}>
                <Form.Item name="privacy" className="w-full">
                  <Radio.Group className="w-full">
                    <div className="flex flex-col gap-2 mx-4">
                      {objectPrivacy.map(item => {
                        return (
                          <PrivacyItem
                            key={item.value}
                            icon={item.icon}
                            title={item.title}
                            description={item.description}
                            value={item.value}
                            onClick={() => {
                              const cur = form.getFieldValue('privacy');
                              if (cur !== item.value) {
                                form.setFieldValue('privacy', item.value);
                              }
                            }}
                          />
                        );
                      })}
                    </div>
                  </Radio.Group>
                </Form.Item>
              </Form>
              <div className="mt-2 border-t border-gray-200"></div>
              <div className="mx-4">
                <Paragraph
                  className="!mb-0"
                  type="secondary"
                  ellipsis={{ rows: 2 }}
                >
                  Chỉ bạn bè và các quan hệ kết nối của bạn mới có thể trực tiếp
                  trả lời tin bạn đăng.
                </Paragraph>
              </div>
              <div className="mb-2 border-b border-gray-200"></div>
              <div className="flex justify-end mx-4 mb-4 gap-3">
                <Button type="text" size="large" className="!text-red-500">
                  <TextGradient
                    className="!text-lg font-medium"
                    onClick={onCancel}
                  >
                    Hủy
                  </TextGradient>
                </Button>
                <ButtonGradient
                  size="large"
                  className="!w-25"
                  onClick={() => {
                    form.submit();
                  }}
                >
                  Lưu
                </ButtonGradient>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalPrivacy;
