import {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  forwardRef,
} from "react";
import { OutlinedInput, InputAdornment, IconButton } from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import Check from "@mui/icons-material/Check";

export default forwardRef((props, ref) => {
  const [edit, setEdit] = useState(false);
  const [editValue, setEditValue] = useState(props.value);

  const inputRef = useRef(null);

  useEffect(() => {
    if (edit) {
      inputRef.current.focus();
    }
  }, [edit]);

  useImperativeHandle(ref, () => ({
    toggleEdit: () => {
      if (edit) {
        handleClickCheck();
      } else {
        setEdit(true);
      }
    },
  }));

  const handleClickEdit = (e) => {
    if (props.editable) {
      setEdit((edit) => !edit);
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      handleClickCheck();
    }
  };

  const handleClickCheck = () => {
    setEdit(false);
    props.onChange(editValue);
  };

  return (
    <>
      {edit ? (
        <OutlinedInput
          sx={{
            p: props.editable ? undefined : 0.5,
          }}
          multiline={true}
          maxRows={4}
          inputRef={inputRef}
          size="small"
          fullWidth={true}
          value={editValue}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          endAdornment={
            props.editable && (
              <InputAdornment sx={{ margin: 0 }} position="end">
                <IconButton
                  sx={{ p: 0 }}
                  aria-label="check"
                  onClick={handleClickCheck}
                  edge="end"
                >
                  <Check />
                </IconButton>
              </InputAdornment>
            )
          }
        ></OutlinedInput>
      ) : (
        <ListItemText
          sx={{ wordBreak: "break-word", color: "white" }}
          primary={props.value}
          onClick={handleClickEdit}
        />
      )}
    </>
  );
});
