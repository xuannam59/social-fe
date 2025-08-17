import AvatarUser from '@social/components/common/AvatarUser';
import ButtonGradient from '@social/components/common/ButtonGradient';
import HeaderStory from '@social/components/headers/HeaderStory';
import ModalPrivacy from '@social/components/modals/stories/ModalPrivacy';
import StoryButtonCreate from '@social/components/stories/StoryButtonCreate';
import StoryEdit from '@social/components/stories/StoryEdit';
import { useAppSelector } from '@social/hooks/redux.hook';
import { Button, Form, Typography } from 'antd';
import { useCallback, useMemo, useRef, useState } from 'react';
import { LuImages } from 'react-icons/lu';
import { TbSettings, TbTextSize } from 'react-icons/tb';

const { Title, Paragraph, Text } = Typography;

const StoryCreate = () => {
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const [image, setImage] = useState<File>();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isText, setIsText] = useState(false);
  const [form] = Form.useForm();
  const [privacy, setPrivacy] = useState<string>('public');
  const [openSetting, setOpenSetting] = useState(false);
  const [type, setType] = useState<string>('');

  const isShowEdit = useMemo(() => {
    return !type || !image;
  }, [image, type]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      inputRef.current!.value = '';
    }
  }, []);

  const onCancel = useCallback(() => {
    setType('');
    setImage(undefined);
  }, []);

  const handleSave = useCallback((file: File) => {
    const data = {
      type: type,
      file,
      privacy,
    };
    console.log('data', data);
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gray-100 w-full max-w-full">
        <div className="flex h-screen max-h-screen">
          <HeaderStory />
          <div className="w-[360px] bg-white shadow-md relative">
            <div className="flex flex-col border-b border-gray-200">
              <div className="w-full h-14"></div>
              <div className="flex justify-between mt-5 mb-3 mx-4">
                <div className="flex flex-col flex-2/3">
                  <div className="h-3"></div>
                  <Title level={3} className="!mb-0">
                    Tin của bạn
                  </Title>
                </div>
                <div className="flex-1/3 flex justify-end">
                  <Button
                    shape="circle"
                    type="text"
                    size="large"
                    className="!bg-gray-200"
                    onClick={() => setOpenSetting(true)}
                  >
                    <TbSettings size={25} className="text-black" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-start items-center mx-4 pb-3">
                <div className="my-2 mr-3">
                  <AvatarUser avatar={userInfo?.avatar} size={62} />
                </div>
                <div className="flex flex-col">
                  <Paragraph
                    className="!mb-0 text-black font-semibold !text-[16px]"
                    ellipsis={{ rows: 1 }}
                  >
                    {userInfo?.fullname}
                  </Paragraph>
                </div>
              </div>
            </div>
            {type === 'image' && image && (
              <>
                <div className="flex flex-col items-start justify-center m-4">
                  <div
                    className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer w-full h-14"
                    onClick={() => {
                      setIsText(true);
                    }}
                  >
                    <div className="flex items-center justify-start">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200">
                        <TbTextSize size={25} />
                      </div>
                      <div className="text-lg font-medium ml-2">
                        Thêm văn bản
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 shadow-md inset-shadow-sm px-4">
                  <div className="flex h-[72px] justify-between items-center gap-2">
                    <div className="flex flex-1/3 items-center">
                      <Button
                        color="default"
                        variant="filled"
                        className="!w-full"
                        onClick={onCancel}
                      >
                        Bỏ qua
                      </Button>
                    </div>
                    <div className="flex flex-2/3 items-center">
                      <ButtonGradient
                        className="!w-full"
                        onClick={() => {
                          form.submit();
                        }}
                      >
                        Chia sẻ lên tin
                      </ButtonGradient>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="flex-1 max-h-screen">
            {isShowEdit ? (
              <div className="h-full flex flex-col items-center justify-center">
                <div className="flex justify-center items-center">
                  <div className="w-[460px] h-[330px]">
                    <div className="grid grid-cols-2 gap-5 w-full h-full">
                      <StoryButtonCreate
                        icon={<LuImages size={24} />}
                        title="Tạo tin dạng ảnh"
                        onClick={() => {
                          inputRef.current?.click();
                          setType('image');
                        }}
                        className="bg-gradient-to-tl from-primary to-secondary rounded-lg"
                      />
                      <StoryButtonCreate
                        icon={<TbTextSize size={24} />}
                        title="Tạo tin dạng văn bản"
                        onClick={() => {
                          setType('text');
                        }}
                        className="bg-gradient-to-br from-purple-600 to-sky-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <StoryEdit
                formSubmit={form}
                image={image}
                isText={isText}
                type={type}
                onCancel={() => setIsText(false)}
                handleSave={handleSave}
              />
            )}
          </div>
        </div>
      </div>
      <input
        type="file"
        id="file-input"
        name="file-input"
        multiple={false}
        className="hidden"
        accept="image/*"
        ref={inputRef}
        onChange={handleChange}
      />
      {openSetting && (
        <ModalPrivacy
          open={openSetting}
          onClose={() => setOpenSetting(false)}
          onSubmit={setPrivacy}
          privacy={privacy}
        />
      )}
    </>
  );
};

export default StoryCreate;
