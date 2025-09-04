import MentionsUser from '@social/components/common/MentionsUser';
import { Button, Form, Image, Input, type FormInstance } from 'antd';
import React, { useCallback, useRef, useState } from 'react';
import AvatarUser from '../common/AvatarUser';
import ButtonEmoji from '../common/ButtonEmoji';
import { TbPhotoPlus, TbSend, TbX } from 'react-icons/tb';
import type { IPreviewMedia } from '@social/types/posts.type';
import { convertMentions, formatFile } from '@social/common/convert';
import { useAppSelector } from '@social/hooks/redux.hook';
import type { IFormComment } from '@social/types/comments.type';
import { smartUpload } from '@social/common/uploads';

interface IProps {
  onSubmit: (values: IFormComment) => void;
  form: FormInstance;
  parentId?: string;
  placeEmoji?: 'bottomRight' | 'bottomLeft' | 'topRight' | 'topLeft';
  level: number;
}

const CommentInput: React.FC<IProps> = ({
  onSubmit,
  form,
  parentId,
  placeEmoji = 'bottomRight',
  level,
}) => {
  const [medias, setMedias] = useState<IPreviewMedia[]>([]);
  const hasImage = useRef(true);
  const inputRef = useRef<any>(null);
  const fileInputRef = useRef<any>(null);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const emojiInputRef = useRef<any>(null);
  const checkEmptyContent = Form.useWatch(parentId, form);
  React.useEffect(() => {
    if (inputRef.current) {
      emojiInputRef.current = inputRef.current;
    }
  }, []);

  const onFinish = async (values: any) => {
    const { parentId } = values;
    const content = level === 0 ? values.content : values[parentId];
    setIsLoadingSubmit(true);
    try {
      const payload: IFormComment = {
        postId: '',
        parentId,
        level: Math.min(level, 2),
        content,
        media:
          medias.length > 0
            ? {
                keyS3: '',
                type: '',
                file: medias[0].file,
              }
            : undefined,
        mentions: convertMentions(content),
      };

      onSubmit(payload);

      form.resetFields();
      setMedias([]);
      hasImage.current = true;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingSubmit(false);
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

  const onPressEnter = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        if (!checkEmptyContent) {
          return;
        }
        e.preventDefault();
        form.submit();
      }
    },
    [checkEmptyContent, form]
  );

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ parentId: parentId }}
        disabled={isLoadingSubmit}
      >
        <div className="flex-shrink-0 flex gap-2 items-start p-3">
          <AvatarUser avatar={userInfo.avatar} size={30} />
          <div className="flex flex-col flex-1 gap-2">
            <Form.Item name="parentId" hidden>
              <Input />
            </Form.Item>
            <div className="bg-gray-200 rounded-lg flex flex-col">
              <MentionsUser
                inputRef={inputRef}
                onPressEnter={onPressEnter}
                fieldName={parentId}
                loading={isLoadingSubmit}
              />
              <div className="flex justify-start cursor-text mx-1">
                <div className="flex items-center flex-1">
                  <ButtonEmoji
                    form={form}
                    inputRef={emojiInputRef}
                    placements={placeEmoji}
                    fieldName={parentId}
                  />
                  {hasImage.current && (
                    <Button
                      type="text"
                      shape="circle"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isLoadingSubmit}
                    >
                      <TbPhotoPlus size={20} className="text-gray-500" />
                    </Button>
                  )}
                </div>
                <div className="flex items-center">
                  <Button
                    type="text"
                    shape="circle"
                    disabled={!checkEmptyContent || isLoadingSubmit}
                    onClick={() => form.submit()}
                  >
                    <TbSend
                      size={20}
                      className={
                        !checkEmptyContent || isLoadingSubmit
                          ? 'text-gray-500'
                          : 'text-primary'
                      }
                    />
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
