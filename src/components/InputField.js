import styled from "@emotion/styled";
import { FormControl, InputLabel, TextField } from "@mui/material";

const InputFieldComponent = styled(TextField)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(2),
  },
}));

export default function InputField({ label, fullWidth, ...props }) {
  return (
    <FormControl fullWidth={fullWidth}>
      <InputLabel variant="standard" shrink>
        {label}
      </InputLabel>
      <InputFieldComponent variant="outlined" size="small" {...props} />
    </FormControl>
  );
}
