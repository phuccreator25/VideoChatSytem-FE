import type { AlertColor } from "@mui/material";

export type ToastType = {
  open: boolean;
  message: string;
  severity: AlertColor;
};
