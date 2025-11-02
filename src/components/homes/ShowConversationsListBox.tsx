import { useAppSelector } from '@social/hooks/redux.hook';
import { Tooltip } from 'antd';
import { useState } from 'react';
import { TbMessageCirclePlus } from 'react-icons/tb';
import ConversationItemBox from '../conversations/box/ConversationItemBox';
import ModalCreateConversation from '../modals/conversations/ModalCreateConversation';

const ShowConversationsListBox = () => {
  const { openConversations } = useAppSelector(state => state.conversations);

  const [openCreateGroupModal, setOpenCreateGroupModal] = useState(false);
  const handleCloseModal = () => {
    setOpenCreateGroupModal(false);
  };

  return (
    <>
      <div className="fixed bottom-0 right-10 w-fit h-fit z-40 overflow-visible">
        <div className="flex items-end gap-3">
          <div className="flex gap-2">
            {openConversations.map(conversation => (
              <ConversationItemBox
                key={conversation._id}
                conversation={conversation}
              />
            ))}
          </div>
          <div className="bg-white size-12 rounded-full shadow-lg overflow-hidden mb-4 hover:bg-gray-100">
            <div
              className="flex items-center justify-center w-full h-full cursor-pointer"
              onClick={() => setOpenCreateGroupModal(true)}
            >
              <Tooltip title="Tạo nhóm chat">
                <TbMessageCirclePlus size={25} />
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
      <ModalCreateConversation
        open={openCreateGroupModal}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default ShowConversationsListBox;
