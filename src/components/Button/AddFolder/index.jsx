import { Button, Box } from "@mui/material";
import Add from "@mui/icons-material/Add";

export default function AddFolderButton(props) {
  return (
    <Button variant="outlined" fullWidth={true} color="primary" onClick={props.onClick}>
      <Box sx={{
        display: "flex",
        alignItems: "center",
      }}>
        <Add />
        <Box sx={{ ml: 1 }}>Add Folder</Box>
      </Box>
    </Button>
  );
}
