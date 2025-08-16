import AvatarUser from '@social/components/common/AvatarUser';
import HeaderStory from '@social/components/headers/HeaderStory';
import StoryButtonCreate from '@social/components/stories/StoryButtonCreate';
import { useAppSelector } from '@social/hooks/redux.hook';
import { Button, Typography } from 'antd';
import { LuImages } from 'react-icons/lu';
import { TbSettings, TbTextSize } from 'react-icons/tb';
import { useRef } from 'react';

const { Title, Paragraph } = Typography;

const StoryCreate = () => {
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log(file);
    }
  };
  return (
    <>
      <div className="min-h-screen bg-gray-100 w-full max-w-full">
        <div className="flex h-screen max-h-screen">
          <HeaderStory />
          <div className="w-[360px] bg-white shadow-md">
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
          </div>
          <div className="flex-1 max-h-screen h-full flex flex-col justify-center items-center relative">
            <div className="flex justify-center items-center">
              <div className="max-w-[460px] w-[460px] h-[330px] max-h-[330px]">
                <div className="grid grid-cols-2 gap-5 w-full h-full">
                  <StoryButtonCreate
                    icon={<LuImages size={24} />}
                    title="Tạo tin dạng ảnh"
                    onClick={() => {
                      inputRef.current?.click();
                    }}
                    className="bg-gradient-to-tl from-primary to-secondary rounded-lg"
                  />
                  <StoryButtonCreate
                    icon={<TbTextSize size={24} />}
                    title="Tạo tin dạng văn bản"
                    onClick={() => {}}
                    className="bg-gradient-to-br from-purple-600 to-sky-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
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
    </>
  );
};

export default StoryCreate;
