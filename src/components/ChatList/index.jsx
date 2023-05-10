import { List } from "@mui/material";
import ChatItem from "../ChatItem";

export default function ChatList(props) {
  return (
    <List component="div" disablePadding>
      {props.chats &&
        props.chats
          .sort((a, b) => new Date(b.update_time) - new Date(a.update_time))
          .map((chat) => (
            <ChatItem
              key={chat.id}
              {...chat}
              active={chat.id === props.currentChatId}
              onChangeChatTitle={(newTitle) => {
                props.onChangeChatTitle(chat.id, newTitle);
              }}
              onMoveChat={(targetFolderId) => {
                props.onMoveChat(chat.id, targetFolderId);
              }}
              onClickDelete={() => {
                props.onDeleteChat(chat.id);
              }}
              onClickChat={props.onClickChat}
            />
          ))}
    </List>
  );
}
