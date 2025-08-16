import { Avatar, type AvatarProps } from 'antd';
import defaultAvatar from '@social/images/default-avatar.webp';

interface IProps extends AvatarProps {
  avatar: string | undefined;
  size?: number;
}

const AvatarUser: React.FC<IProps> = ({ avatar, size, ...props }) => {
  return (
    <>
      <Avatar
        size={size ? size : 50}
        src={avatar || defaultAvatar}
        {...props}
      />
    </>
  );
};

export default AvatarUser;
