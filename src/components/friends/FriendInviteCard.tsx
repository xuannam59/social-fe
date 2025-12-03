import type { IInvitationFriend } from '@social/types/friends.type';
import AvatarUser from '../common/AvatarUser';
import ButtonGradient from '../common/ButtonGradient';
import { Button, message } from 'antd';
import {
  callApiAcceptFriend,
  callApiRejectFriend,
} from '@social/apis/friend.api';
import { NOTIFICATION_MESSAGE } from '@social/defaults/socket.default';
import { useSockets } from '@social/providers/SocketProvider';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface IProps {
  invitation: IInvitationFriend;
}

const FriendInviteCard: React.FC<IProps> = ({ invitation }) => {
  const friendInfo = invitation.fromUserId;
  const [isLoadingAccept, setIsLoadingAccept] = useState(false);
  const [isLoadingReject, setIsLoadingReject] = useState(false);
  const { socket } = useSockets();
  const navigate = useNavigate();

  const handleOpenProfile = useCallback(() => {
    navigate(`/${friendInfo._id}`);
  }, [friendInfo._id, navigate]);

  const handleAcceptInvite = useCallback(
    async (friendId: string) => {
      if (!friendId) return;
      try {
        setIsLoadingAccept(true);
        const res = await callApiAcceptFriend(friendId);
        if (res.data) {
          message.success('Lời mời đã được chấp nhận');
          socket.emit(NOTIFICATION_MESSAGE.FRIEND_REQUEST_ACCEPT, {
            friendId,
          });
        }
      } catch (error) {
        console.error('Failed to accept invite:', error);
        message.error('Có lỗi xảy ra');
      } finally {
        setIsLoadingAccept(false);
      }
    },
    [socket]
  );

  const handleRejectInvite = useCallback(
    async (friendId: string) => {
      if (!friendId) return;
      try {
        setIsLoadingReject(true);
        const res = await callApiRejectFriend(friendId);
        if (res.data) {
          message.success('Lời mời đã được từ chối');
          socket.emit(NOTIFICATION_MESSAGE.FRIEND_REQUEST_REJECT, {
            friendId,
          });
        }
      } catch (error) {
        console.error('Failed to reject invite:', error);
        message.error('Có lỗi xảy ra');
      } finally {
        setIsLoadingReject(false);
      }
    },
    [socket]
  );

  return (
    <>
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
        <div className="p-4 flex flex-col items-center">
          <div className="mb-3">
            <AvatarUser
              avatar={friendInfo.avatar}
              size={80}
              className="cursor-pointer"
              onClick={handleOpenProfile}
            />
          </div>

          <h3
            className="font-semibold text-base mb-2 text-center line-clamp-1 w-full cursor-pointer"
            onClick={handleOpenProfile}
          >
            {friendInfo.fullname}
          </h3>

          <div className="w-full flex flex-col gap-2">
            <ButtonGradient
              type="primary"
              onClick={() => handleAcceptInvite(friendInfo._id)}
              loading={isLoadingAccept}
              disabled={isLoadingReject}
            >
              Chấp nhận
            </ButtonGradient>
            <Button
              className="w-full"
              onClick={() => handleRejectInvite(friendInfo._id)}
              loading={isLoadingReject}
              disabled={isLoadingAccept}
            >
              Từ chối
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FriendInviteCard;
