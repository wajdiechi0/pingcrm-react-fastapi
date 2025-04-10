import { TextField, TextFieldProps, MenuItem } from "@mui/material";
import { forwardRef } from "react";

interface Option {
  value: string;
  label: string;
}

interface FormSelectFieldProps extends Omit<TextFieldProps, "sx" | "select"> {
  options: Option[];
  fullWidth?: boolean;
}

export const FormSelectField = forwardRef<HTMLDivElement, FormSelectFieldProps>(
  ({ options, fullWidth = true, ...props }, ref) => {
    return (
      <TextField
        ref={ref}
        select
        fullWidth={fullWidth}
        variant="outlined"
        size="small"
        sx={{ mb: 2 }}
        {...props}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    );
  }
);

FormSelectField.displayName = "FormSelectField"; 