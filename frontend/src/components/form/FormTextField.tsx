import { TextField, TextFieldProps } from "@mui/material";
import { forwardRef } from "react";

interface FormTextFieldProps extends Omit<TextFieldProps, "sx"> {
  fullWidth?: boolean;
}

export const FormTextField = forwardRef<HTMLDivElement, FormTextFieldProps>(
  ({ fullWidth = true, ...props }, ref) => {
    return (
      <TextField
        ref={ref}
        fullWidth={fullWidth}
        variant="outlined"
        size="small"
        sx={{ mb: 2 }}
        {...props}
      />
    );
  }
);

FormTextField.displayName = "FormTextField";
