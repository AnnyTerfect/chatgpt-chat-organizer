import { Box } from "@mui/material";
import ListItemIcon from "@mui/material/ListItemIcon";
import FolderIcon from "@mui/icons-material/Folder";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import EditableText from "../EditableText";

export default function ChatTitle(props) {
  const active = props.chats
    .map((chat) => chat.id)
    .includes(location.href.split("/").pop());

  const handleClickSwitch = () => {
    props.setOpen(!props.open);
  };

  return (
    <Box
      sx={{
        p: 1,
        py: 1.5,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        cursor: "pointer",
        backgroundColor: active ? "#404040" : "transparent",
        color: "white",
      }}
      onClick={handleClickSwitch}
    >
      <ListItemIcon sx={{ minWidth: "36px" }}>
        <FolderIcon />
      </ListItemIcon>
      <EditableText
        value={props.title}
        onChange={props.onChangeTitle}
        editable={true}
      />
      {props.open ? <ExpandLess /> : <ExpandMore />}
    </Box>
  );
}
