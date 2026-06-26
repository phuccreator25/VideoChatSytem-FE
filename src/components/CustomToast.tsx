import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import type { Dispatch, SetStateAction } from "react";
import type { ToastType } from "../types/layout/layout.toast.type";
type CustomToastProps = {
    toast: ToastType;
    setToast: Dispatch<SetStateAction<ToastType>>;
};

function CustomToast({ toast, setToast }: CustomToastProps) {
    const { open, message, severity } = toast;

    const handleClose = () => {
        setToast((prev) => ({ ...prev, open: false }));
    };

    return (
        <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
            <Alert
                onClose={handleClose}
                severity={severity}
                variant="filled"
                sx={{ width: '100%' }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
}

export default CustomToast;
