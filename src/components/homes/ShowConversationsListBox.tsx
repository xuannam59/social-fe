import { useAppSelector } from '@social/hooks/redux.hook';
import ConversationItemBox from '../conversations/ConversationItemBox';

const ShowConversationsListBox = () => {
  const openConversations = useAppSelector(
    state => state.conversations.openConversations
  );

  return (
    <div className="fixed bottom-0 right-10 w-fit h-fit z-40 overflow-visible">
      <div className="flex gap-2">
        {openConversations.map(conversation => (
          <ConversationItemBox
            key={conversation._id}
            conversation={conversation}
          />
        ))}
      </div>
    </div>
  );
};

export default ShowConversationsListBox;
