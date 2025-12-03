import {
  callApiAcceptFriend,
  callApiRejectFriend,
} from '@social/apis/friend.api';
import { formatRelativeTime } from '@social/common/convert';
import { NOTIFICATION_MESSAGE } from '@social/defaults/socket.default';
import { useSockets } from '@social/providers/SocketProvider';
import type { IInvitationFriend } from '@social/types/friends.type';
import { Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import AvatarUser from '../common/AvatarUser';
import ButtonGradient from '../common/ButtonGradient';
interface IProps {
  invitation: IInvitationFriend;
  onRemoveInvitation: (invitationId: string) => void;
}

const InviteFriendCard: React.FC<IProps> = ({
  invitation,
  onRemoveInvitation,
}) => {
  const friendInfo = invitation.fromUserId;
  const navigate = useNavigate();
  const { socket } = useSockets();
  const acceptInvite = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await callApiAcceptFriend(friendInfo._id);
      if (res.data) {
        message.success('Lời mời đã được chấp nhận');
        onRemoveInvitation(invitation._id);
        socket.emit(NOTIFICATION_MESSAGE.FRIEND_REQUEST_ACCEPT, {
          friendId: friendInfo._id,
        });
      }
    } catch (error) {
      console.error('Failed to accept invite:', error);
      message.error('Có lỗi xảy ra');
    }
  };

  const rejectInvite = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await callApiRejectFriend(friendInfo._id);
      if (res.data) {
        message.success('Lời mời đã được từ chối');
        onRemoveInvitation(invitation._id);
        socket.emit(NOTIFICATION_MESSAGE.FRIEND_REQUEST_REJECT, {
          friendId: friendInfo._id,
        });
      }
    } catch (error) {
      console.error('Failed to reject invite:', error);
      message.error('Có lỗi xảy ra');
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/${friendInfo._id}`);
  };

  return (
    <>
      <div
        className="flex items-center gap-3 cursor-pointer hover:bg-gray-200 rounded-lg p-2"
        onClick={handleClick}
      >
        <AvatarUser avatar={friendInfo.avatar} size={55} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-base truncate">
              {friendInfo.fullname}
            </p>
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {formatRelativeTime(invitation.createdAt)}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <ButtonGradient
              type="primary"
              className="flex-1"
              onClick={acceptInvite}
            >
              Xác nhận
            </ButtonGradient>
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
