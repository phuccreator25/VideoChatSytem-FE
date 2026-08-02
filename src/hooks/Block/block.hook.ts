import { useState } from "react";
import type { contacts } from "../../types/contact/contact.model.type";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import { onHandleBlockUser, onHandleUnBlockUser } from "../../redux/block.redux";
import { enqueueSnackbar } from "notistack";

export function useBlock() {
  const [openModalBlock, setOpenModalBlock] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleBlock = async (payload: contacts) => {
    try {
      await dispatch(onHandleBlockUser(payload.userId)).unwrap()
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Block user failed. Please try again", { variant: "error" });
    }
  };

  const handleUnblock = async (payload: contacts) => {
    try {
      await dispatch(onHandleUnBlockUser(payload.userId)).unwrap()
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Unblock user failed. Please try again", { variant: "error" });
    }
  };

  return {
    ui: {
      openModalBlock,
    },
    handlers: {
      setOpenModalBlock,
      handleBlock,
      handleUnblock,
    },
  };
}
