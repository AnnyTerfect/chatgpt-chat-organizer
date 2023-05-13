import { useRef } from "react";
import { Box, IconButton, ListItemIcon } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import EditableText from "../EditableText";
import FolderSelector from "../FolderSelector";

export default function Chat(props) {
  const editableTextRef = useRef(null);

  return (
    <>
      <Box
        sx={{
          p: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          backgroundColor: props.active ? "#404040" : "transparent", // Whether the chat is active
        }}
        onClick={() => props.onClickChat(props.id)}
      >
        <ListItemIcon sx={{ minWidth: "36px" }}>
          <ChatIcon />
        </ListItemIcon>
        <EditableText
          ref={editableTextRef}
          value={props.title}
          onChange={props.onChangeChatTitle}
          editable={false}
        />
        {/*Functional buttons include edit, move, and delete*/}
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
          }}
        >
          <IconButton
            sx={{ p: 0.5 }}
            onClick={(e) => {
              e.stopPropagation();
              editableTextRef.current?.toggleEdit();
            }}
          >
            <Edit />
          </IconButton>
          <FolderSelector
            sx={{ p: 0.5 }}
            chats={props.chats}
            onSelect={(folderId) => props.onMoveChat(folderId)}
          />
          <IconButton
            sx={{ p: 0.5 }}
            onClick={(e) => {
              e.stopPropagation();
              props.onClickDelete();
            }}
          >
            <Delete />
          </IconButton>
        </Box>
      </Box>
    </>
  );
}
