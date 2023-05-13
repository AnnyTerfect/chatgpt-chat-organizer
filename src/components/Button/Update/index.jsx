import { Button } from "@mui/material";
import { GM_info } from "$";

const updateURL =
  GM_info.scriptUpdateURL ||
  GM_info.script.updateURL ||
  GM_info.script.downloadURL;

export default function Update() {
  return (
    <Button
      variant="outlined"
      color="primary"
      onClick={() => {
        window.open(updateURL, "_blank");
      }}
    >
      New version available
    </Button>
  );
}
