import type { IConversation } from '@social/types/conversations.type';
import { Button, type MenuProps } from 'antd';
import { Dropdown } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import {
  TbDots,
  TbPencil,
  TbTrash,
  TbUsers,
  TbUsersPlus,
} from 'react-icons/tb';
import { useAppSelector } from '@social/hooks/redux.hook';
import { useAppDispatch } from '@social/hooks/redux.hook';
import ModalConversationMember from '@social/components/modals/conversations/ModalConversationMember';
import ModalConversationAddMember from '@social/components/modals/conversations/ModalConversationAddMember';

interface IProps {
  conversation: IConversation;
}
const ConversationButtonDots: React.FC<IProps> = ({ conversation }) => {
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const dispatch = useAppDispatch();
  const [openModalMember, setOpenModalMember] = useState(false);
  const [openModalAddMember, setOpenModalAddMember] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const isAdmin = useMemo(() => {
    return conversation.admins.includes(userInfo._id);
  }, [conversation.admins, userInfo._id]);

  const handleDelete = useCallback(() => {
    console.log('delete');
  }, []);

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
    handleDelete,
    handleOpenModalMember,
    handleOpenModalAddMember,
    handleOpenModalUpdate,
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
    </>
  );
};

export default ConversationButtonDots;
