import type { IUser } from '@social/types/user.type';
import AvatarUser from '../common/AvatarUser';
import { formatRelativeTime } from '@social/common/convert';
import {
  callApiAcceptFriend,
  callApiRejectFriend,
} from '@social/apis/friend.api';
import { Button, message } from 'antd';
import type { IFriend } from '@social/types/friends.type';
import { useNavigate } from 'react-router-dom';
interface IProps {
  invitation: IFriend;
}

const InviteFriendCard: React.FC<IProps> = ({ invitation }) => {
  const user = invitation.fromUserId as IUser;
  const navigate = useNavigate();
  const acceptInvite = async () => {
    try {
      const res = await callApiAcceptFriend(user._id);
      if (res.data) {
        message.success('Lời mời đã được chấp nhận');
      }
    } catch (error) {
      console.error('Failed to accept invite:', error);
      message.error('Có lỗi xảy ra');
    }
  };

  const rejectInvite = async () => {
    try {
      const res = await callApiRejectFriend(user._id);
      if (res.data) {
        message.success('Lời mời đã được từ chối');
      }
    } catch (error) {
      console.error('Failed to accept invite:', error);
      message.error('Có lỗi xảy ra');
    }
  };
  return (
    <>
      <div
        className="flex items-center gap-3 cursor-pointer hover:bg-gray-200 rounded-lg p-2"
        onClick={() => {
          navigate(`/${user._id}`);
        }}
      >
        <AvatarUser avatar={user.avatar} size={55} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-base truncate">{user.fullname}</p>
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {formatRelativeTime(invitation.createdAt)}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Button type="primary" className="flex-1" onClick={acceptInvite}>
              Xác nhận
            </Button>
            <Button
              color="default"
              variant="filled"
              className="flex-1"
              onClick={rejectInvite}
            >
              Xóa
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-3 h-px bg-gray-300" />
    </>
  );
};

export default InviteFriendCard;
