import { Collapse, Box, Button } from "@mui/material";
import ChatList from "../ChatList";
import FolderTitle from "../FolderTitle";

export default function (props) {
  return (
    <>
      <FolderTitle {...props} />

      <Collapse in={props.open} timeout="auto" unmountOnExit>
        <Box sx={{ pl: 2 }}>
          <ChatList {...props} />
        </Box>
        <Button fullWidth={true} onClick={() => props.onDeleteFolder(props.id)}>Delete Folder</Button>
      </Collapse>
    </>
  );
}
