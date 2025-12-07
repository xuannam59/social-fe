import { callApiUnsavePost } from '@social/apis/posts.api';
import { convertErrorMessage, convertUrlString } from '@social/common/convert';
import noImage from '@social/images/not-image.png';
import type { IPostSave } from '@social/types/posts.type';
import { Button, Dropdown, Image, message } from 'antd';
import { useMemo } from 'react';
import { TbBookmarkOff, TbDots } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import AvatarUser from '../common/AvatarUser';

interface IProps {
  post: IPostSave;
  onDeletePostSave: (postId: string) => void;
  onOpenPost: (postId: string) => void;
}

const PostSaveItemCard: React.FC<IProps> = ({
  post,
  onDeletePostSave,
  onOpenPost,
}) => {
  const navigate = useNavigate();
  const media = useMemo(() => {
    if (post.postId.medias.length === 0) {
      return noImage;
    }

    if (post.postId.medias[0].type === 'video') {
      return noImage;
    }

    return convertUrlString(post.postId.medias[0].keyS3);
  }, [post.postId.medias]);

  const handleOpenProfile = () => {
    navigate(`/${post.postId.authorId._id}`);
  };

  const handleDeletePostSave = async () => {
    try {
      const res = await callApiUnsavePost(post.postId._id);
      if (res.data) {
        message.success(res.data);
        onDeletePostSave(post.postId._id);
      } else {
        message.error(convertErrorMessage(res.message));
      }
    } catch (error) {
      console.log(error);
      message.error('Lỗi khi bỏ lưu bài viết');
    }
  };
  return (
    <>
      <div className="w-full p-3 bg-white rounded-lg shadow-md">
        <div className="flex gap-3">
          <div className="cursor-pointer rounded-lg overflow-hidden border border-gray-200">
            <Image
              src={media}
              alt={post.postId.content}
              width={144}
              height={144}
              preview={false}
            />
          </div>
          <div className="flex-1">
            <div className="w-full mb-2">
              <span
                className="text-h3 font-bold line-clamp-1 hover:underline cursor-pointer"
                onClick={() => onOpenPost(post.postId._id)}
              >
                {post.postId.content}
              </span>
            </div>
            <div className="w-full flex items-center gap-2 mb-2">
              <div
                className="border border-gray-200 rounded-full shadow-md cursor-pointer"
                onClick={handleOpenProfile}
              >
                <AvatarUser avatar={post.postId.authorId.avatar} size={28} />
              </div>

              <div className="text-sm line-clamp-1">
                <span className="text-gray-500">Đã lưu từ </span>
                <span
                  className="font-medium hover:underline cursor-pointer"
                  onClick={() => onOpenPost(post.postId._id)}
                >
                  bài viết của {post.postId.authorId.fullname}
                </span>
              </div>
            </div>
            <div className="w-full flex items-center gap-2">
              <Dropdown
                trigger={['click']}
                placement="bottomLeft"
                arrow={true}
                menu={{
                  items: [
                    {
                      label: 'Bỏ lưu bài viết',
                      key: 'unsave',
                      icon: <TbBookmarkOff size={20} />,
                      onClick: handleDeletePostSave,
                    },
                  ],
                }}
              >
                <Button color="default" variant="filled">
                  <TbDots size={20} />
                </Button>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostSaveItemCard;
