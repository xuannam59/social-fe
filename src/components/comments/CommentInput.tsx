import MentionsUser from '@social/components/common/MentionsUser';
import { Button, Form, Image, type FormInstance } from 'antd';
import React, { useRef, useState } from 'react';
import AvatarUser from '../common/AvatarUser';
import ButtonEmoji from '../common/ButtonEmoji';
import { TbPhotoPlus, TbSend, TbX } from 'react-icons/tb';
import type { IPreviewMedia } from '@social/types/posts.type';
import { convertMentions, formatFile } from '@social/common/convert';
import { useAppSelector } from '@social/hooks/redux.hook';
import type { IFormComment } from '@social/types/comments.type';

interface IProps {
  onSubmit: (values: IFormComment) => void;
  form: FormInstance;
}

const CommentInput: React.FC<IProps> = ({ onSubmit, form }) => {
  const [medias, setMedias] = useState<IPreviewMedia[]>([]);
  const hasImage = useRef(true);
  const inputRef = useRef<any>(null);
  const fileInputRef = useRef<any>(null);
  const userInfo = useAppSelector(state => state.auth.userInfo);

  const onFinish = (values: any) => {
    const { content } = values;
    try {
      const mediasUpload: { key: string; type: string }[] = [];
      if (medias.length > 0) {
        // for (const media of medias) {
        //   const file = media.file;
        //   if (file) {
        //     const res = await smartUpload(file);
        //     if (res.data) {
        //       mediasUpload.push({
        //         keyS3: res.data.key,
        //         type: file.type.split('/')[0],
        //       });
        //     } else {
        //       throw new Error(res.message);
        //     }
        //   }
        // }
      }

      const payload: IFormComment = {
        content,
        medias: mediasUpload.map(media => ({
          keyS3: media.key,
          type: media.type,
        })),
        mentions: convertMentions(content),
      };

      onSubmit(payload);

      form.resetFields();
      setMedias([]);
      hasImage.current = true;
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const fileUrls = formatFile(files);
    setMedias(prev => [...prev, ...fileUrls]);
    event.target.value = '';
    hasImage.current = false;
  };

  const handleRemoveMedia = (id: string) => {
    setMedias(prev => prev.filter(m => m.id !== id));
    hasImage.current = true;
  };

  return (
    <>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div className="flex-shrink-0 flex gap-2 items-start p-3 border-t border-gray-200">
          <AvatarUser avatar={userInfo.avatar} size={36} />
          <div className="flex flex-col flex-1 gap-2">
            <div className="bg-gray-200 rounded-lg flex flex-col">
              <MentionsUser
                inputRef={inputRef}
                onPressEnter={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    // Enter không có Shift -> Submit form
                    e.preventDefault();
                    form.submit();
                  }
                }}
              />
              <div className="flex justify-start cursor-text mx-1">
                <div className="flex items-center flex-1">
                  <ButtonEmoji
                    form={form}
                    inputRef={inputRef}
                    field="content"
                    placements="bottomRight"
                  />
                  {hasImage.current && (
                    <Button
                      type="text"
                      shape="circle"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <TbPhotoPlus size={20} className="text-gray-500" />
                    </Button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="text"
                    shape="circle"
                    onClick={() => form.submit()}
                  >
                    <TbSend size={20} className="text-gray-500" />
                  </Button>
                </div>
              </div>
            </div>
            {!hasImage.current && (
              <div className="flex gap-2 items-center">
                {medias.map(media => (
                  <div key={media.id} className="relative">
                    <div className="w-20 h-full flex items-center justify-center">
                      <Image
                        src={media.url}
                        alt="image"
                        className="w-full h-full object-center rounded-lg border border-gray-200"
                        loading="lazy"
                      />
                    </div>

                    <div
                      className="absolute top-0 right-0 cursor-pointer hover:bg-gray-200 rounded-full p-1"
                      onClick={() => handleRemoveMedia(media.id)}
                    >
                      <TbX size={16} className="text-gray-500" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Form>
      <input
        className="hidden"
        type="file"
        multiple={false}
        id="image-upload"
        accept="image/*"
        ref={fileInputRef}
        onChange={onChangeFile}
      />
    </>
  );
};

export default CommentInput;
