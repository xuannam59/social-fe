import type { IConversation } from '@social/types/conversations.type';
import { Button, message, Modal, type MenuProps } from 'antd';
import { Dropdown } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import {
  TbDots,
  TbPencil,
  TbTrash,
  TbUsers,
  TbUsersPlus,
} from 'react-icons/tb';
import { useAppDispatch, useAppSelector } from '@social/hooks/redux.hook';
import ModalConversationMember from '@social/components/modals/conversations/ModalConversationMember';
import ModalConversationAddMember from '@social/components/modals/conversations/ModalConversationAddMember';
import ModalEditConversation from '@social/components/modals/conversations/ModalEditConversation';
import { callApiDeleteConversation } from '@social/apis/conversations.api';
import { doDeleteConversation } from '@social/redux/reducers/conversations.reducer';

interface IProps {
  conversation: IConversation;
}
const ConversationButtonDots: React.FC<IProps> = ({ conversation }) => {
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const dispatch = useAppDispatch();
  const [openModalMember, setOpenModalMember] = useState(false);
  const [openModalAddMember, setOpenModalAddMember] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const isAdmin = useMemo(() => {
    return conversation.admins.includes(userInfo._id);
  }, [conversation.admins, userInfo._id]);

  const handleDelete = useCallback(() => {
    Modal.confirm({
      title: 'Xoá nhóm',
      content: (
        <>
          <span className="text-base text-gray-500">
            Bạn có chắc chắn muốn xoá nhóm này không?
          </span>
          <span className="text-base text-gray-500">
            Tất cả tin nhắn trong nhóm sẽ bị xoá.
          </span>
        </>
      ),
      centered: true,
      okText: 'Xoá',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          setIsLoadingDelete(true);
          const res = await callApiDeleteConversation(conversation._id);
          if (res.data) {
            message.success('Xoá nhóm thành công');
            dispatch(doDeleteConversation(conversation._id));
          } else {
            message.error(res.message);
          }
        } catch (error) {
          console.log(error);
        }
      },
    });
  }, [conversation._id, dispatch]);

  const handleOpenModalMember = useCallback(() => {
    setOpenModalMember(true);
  }, []);

  const handleOpenModalAddMember = useCallback(() => {
    setOpenModalAddMember(true);
  }, []);

  const handleOpenModalUpdate = useCallback(() => {
    setOpenModalUpdate(true);
  }, []);

  const menus = useMemo(() => {
    const items: MenuProps['items'] = [
      {
        label: 'Cập nhập',
        key: 'update',
        icon: <TbPencil size={20} />,
        onClick: handleOpenModalUpdate,
      },
      {
        label: 'Thành viên',
        key: 'members',
        icon: <TbUsers size={20} />,
        onClick: handleOpenModalMember,
      },
      {
        label: 'Thêm thành viên',
        key: 'addMember',
        icon: <TbUsersPlus size={20} />,
        onClick: handleOpenModalAddMember,
      },
    ];
    if (isAdmin) {
      items.push({
        label: (
          <div className="flex items-center gap-2">
            <TbTrash size={20} className="text-red-500" />
            <span className="text-base text-red-500">Xoá nhóm</span>
          </div>
        ),
        key: 'delete',
        onClick: handleDelete,
      });
    }
    return items;
  }, [
    isAdmin,
    handleOpenModalMember,
    handleOpenModalAddMember,
    handleOpenModalUpdate,
    handleDelete,
  ]);

  return (
    <>
      <Dropdown
        trigger={['click']}
        placement="bottomRight"
        menu={{
          items: menus,
        }}
      >
        <Button type="text" shape="circle">
          <TbDots size={20} />
        </Button>
      </Dropdown>
      {openModalMember && (
        <ModalConversationMember
          open={openModalMember}
          onClose={() => setOpenModalMember(false)}
          conversation={conversation}
        />
      )}
      {openModalAddMember && (
        <ModalConversationAddMember
          open={openModalAddMember}
          onClose={() => setOpenModalAddMember(false)}
          conversation={conversation}
        />
      )}
      {openModalUpdate && (
        <ModalEditConversation
          open={openModalUpdate}
          onClose={() => setOpenModalUpdate(false)}
          conversation={conversation}
        />
      )}
    </>
  );
};

export default ConversationButtonDots;
