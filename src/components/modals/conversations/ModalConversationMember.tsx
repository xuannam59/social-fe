import {
  callApiGrantAdminToConversation,
  callApiRemoveMemberFromConversation,
  callApiRevokeAdminFromConversation,
} from '@social/apis/conversations.api';
import AvatarUser from '@social/components/common/AvatarUser';
import { useAppDispatch, useAppSelector } from '@social/hooks/redux.hook';
import {
  doGrantAdminToConversation,
  doRemoveMemberFromConversation,
  doRevokeAdminFromConversation,
} from '@social/redux/reducers/conversations.reducer';
import type { IConversation } from '@social/types/conversations.type';
import { Button, Dropdown, message, Modal, Tabs } from 'antd';
import React, { useCallback, useMemo, useState } from 'react';
import {
  TbDots,
  TbLogout,
  TbUserCircle,
  TbUserShield,
  TbUserX,
  TbX,
} from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';

interface IProps {
  open: boolean;
  onClose: () => void;
  conversation: IConversation;
}
const ModalConversationMember: React.FC<IProps> = ({
  open,
  onClose,
  conversation,
}) => {
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState<'members' | 'admins'>('members');
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const navigate = useNavigate();
  const adminIds = useMemo(() => {
    return new Set(conversation.admins);
  }, [conversation.admins]);
  const listAdmins = useMemo(() => {
    const list: {
      _id: string;
      fullname: string;
      avatar: string;
    }[] = [];
    conversation.users.forEach(user => {
      if (adminIds.has(user._id)) {
        list.push(user);
      }
    });
    return list;
  }, [conversation.users, adminIds]);

  const handleViewProfile = useCallback(
    (userId: string) => {
      onClose();
      navigate(`/${userId}`);
    },
    [navigate, onClose]
  );

  const handleRemoveMember = useCallback(
    (userId: string) => {
      Modal.confirm({
        title: 'Xoá thành viên',
        content: 'Bạn có chắc chắn muốn xoá thành viên này không?',
        centered: true,
        okText: 'Xoá',
        cancelText: 'Hủy',
        onOk: async () => {
          try {
            const payload = {
              userId,
              conversationId: conversation._id,
            };
            const res = await callApiRemoveMemberFromConversation(payload);
            if (res.data) {
              message.success('Xoá thành viên thành công');
              dispatch(
                doRemoveMemberFromConversation({
                  userId,
                  conversationId: conversation._id,
                })
              );
            } else {
              message.error(res.message);
            }
          } catch (error) {
            console.log(error);
          }
        },
      });
    },
    [dispatch, conversation._id]
  );

  const handleAddAdmin = async (userId: string) => {
    try {
      const payload = {
        userId,
        conversationId: conversation._id,
      };
      const res = await callApiGrantAdminToConversation(payload);
      if (res.data) {
        message.success('Cấp quyền quản trị viên thành công');
        dispatch(
          doGrantAdminToConversation({
            userId,
            conversationId: conversation._id,
          })
        );
      } else {
        message.error(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLeaveConversation = useCallback(() => {
    if (adminIds.size < 2) {
      message.error('Vui lòng có ít nhất 2 quản trị viên');
      return;
    }
  }, [adminIds.size]);

  const handleRemoveAdmin = async (userId: string) => {
    try {
      const payload = {
        userId,
        conversationId: conversation._id,
      };
      const res = await callApiRevokeAdminFromConversation(payload);
      if (res.data) {
        message.success('Gỡ quản trị viên thành công');
        dispatch(
          doRevokeAdminFromConversation({
            userId,
            conversationId: conversation._id,
          })
        );
      } else {
        message.error(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Modal
        open={open}
        title={null}
        footer={null}
        closable={false}
        destroyOnHidden={true}
        centered
        className="create-post-modal"
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex-1 flex items-center justify-center">
              <span className="text-h3 font-bold">Thành viên</span>
            </div>
            <Button type="text" shape="circle" onClick={onClose}>
              <TbX size={20} />
            </Button>
          </div>
          <div className="p-4">
            <Tabs
              activeKey={tab}
              onChange={key => setTab(key as 'members' | 'admins')}
              items={[
                {
                  key: 'members',
                  label: 'Thành viên',
                },
                {
                  key: 'admins',
                  label: `Quản trị viên (${adminIds.size})`,
                },
              ]}
            />

            {tab === 'members' ? (
              <div className="flex flex-col gap-2">
                {conversation.users.map(user => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex-shrink-0">
                        <AvatarUser avatar={user.avatar} />
                      </div>
                      <div className="flex flex-col gap-0 5">
                        <span className="text-base font-medium line-clamp-1">
                          {user.fullname}
                        </span>
                        {adminIds.has(user._id) && (
                          <span className="text-sm text-gray-500">
                            Quản trị viên
                          </span>
                        )}
                      </div>
                    </div>
                    <Dropdown
                      trigger={['click']}
                      placement="bottomRight"
                      menu={{
                        items: [
                          {
                            label: 'Xem Trang Cá Nhân',
                            key: 'viewProfile',
                            icon: <TbUserCircle size={20} />,
                            onClick: () => handleViewProfile(user._id),
                          },
                          ...(adminIds.has(user._id) &&
                          user._id !== userInfo._id
                            ? [
                                {
                                  label: 'Xoá thành viên',
                                  key: 'remove',
                                  icon: <TbUserX size={20} />,
                                  onClick: () => handleRemoveMember(user._id),
                                },
                                {
                                  label: 'Cấp quyền quản trị viên',
                                  key: 'addAdmin',
                                  icon: <TbUserShield size={20} />,
                                  onClick: () => handleAddAdmin(user._id),
                                },
                              ]
                            : []),
                          ...(user._id === userInfo._id
                            ? [
                                {
                                  label: 'Rời nhóm',
                                  key: 'leave',
                                  icon: <TbLogout size={20} />,
                                  onClick: handleLeaveConversation,
                                },
                              ]
                            : []),
                        ],
                      }}
                    >
                      <Button type="text" shape="circle">
                        <TbDots size={20} />
                      </Button>
                    </Dropdown>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {listAdmins.map(user => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <AvatarUser avatar={user.avatar} />
                      <div className="flex flex-col gap-0 5">
                        <span className="text-base font-medium">
                          {user.fullname}
                        </span>
                        {adminIds.has(user._id) && (
                          <span className="text-sm text-gray-500">
                            Quản trị viên
                          </span>
                        )}
                      </div>
                    </div>
                    <Dropdown
                      trigger={['click']}
                      placement="bottomRight"
                      menu={{
                        items: [
                          {
                            label: 'Xem Trang Cá Nhân',
                            key: 'viewProfile',
                            icon: <TbUserCircle size={20} />,
                            onClick: () => handleViewProfile(user._id),
                          },
                          ...(adminIds.has(userInfo._id) &&
                          user._id !== userInfo._id
                            ? [
                                {
                                  label: 'Gỡ quản trị viên',
                                  key: 'removeAdmin',
                                  icon: <TbUserX size={20} />,
                                  onClick: () => handleRemoveAdmin(user._id),
                                },
                              ]
                            : []),
                          ...(user._id === userInfo._id
                            ? [
                                {
                                  label: 'Rời nhóm',
                                  key: 'leave',
                                  icon: <TbLogout size={20} />,
                                  onClick: handleLeaveConversation,
                                },
                              ]
                            : []),
                        ],
                      }}
                    >
                      <Button type="text" shape="circle">
                        <TbDots size={20} />
                      </Button>
                    </Dropdown>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalConversationMember;
