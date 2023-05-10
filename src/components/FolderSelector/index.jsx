import { useState, useRef } from "react";
import {
  Box,
  IconButton,
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  MenuList,
  MenuItem,
} from "@mui/material";
import { getFolder } from "../../folder";
import Folder from "@mui/icons-material/Folder";
import MoveToInbox from "@mui/icons-material/MoveToInbox";

export default function FolderSelector(props) {
  const allFolder = getFolder();

  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleToggle = (e) => {
    e.stopPropagation();
    setOpen((open) => !open);
  };

  const handleClose = (event) => {
    console.log(anchorRef.current)
    console.log(anchorRef.current.contains(event.target))
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false)
  };

  return (
    <Box>
      <IconButton
        sx={props.sx}
        ref={anchorRef}
        id="composition-button"
        aria-controls={open ? "composition-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <MoveToInbox />
      </IconButton>
      <Popper
        sx={{ zIndex: 1 }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="bottom"
        transition
        disablePortal
      >
        {({ TransitionProps }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: "center top",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="composition-menu"
                  aria-labelledby="composition-button"
                >
                  {allFolder.map((folder) => {
                    return (
                      <MenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          props.onSelect(folder.id)
                        }}
                        key={folder.id}
                      >
                        <Folder sx={{ mr: 1 }} />
                        {folder.name}
                      </MenuItem>
                    );
                  })}
                  <MenuItem onClick={() => props.onSelect()}>
                    Unfoldered
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Box>
  );
}
