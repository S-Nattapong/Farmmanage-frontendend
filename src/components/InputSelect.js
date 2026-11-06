import styled from "@emotion/styled";
import { FormControl, InputLabel, Select } from "@mui/material";

const InputSelectComponent = styled(Select)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(2),
  },
}));

export default function InputSelect({ children, label, fullWidth, ...props }) {
  return (
    <FormControl fullWidth={fullWidth}>
      <InputLabel variant="standard" shrink>
        {label}
      </InputLabel>
      <InputSelectComponent size="small" variant="outlined" {...props}>
        {children}
      </InputSelectComponent>
    </FormControl>
  );
}
