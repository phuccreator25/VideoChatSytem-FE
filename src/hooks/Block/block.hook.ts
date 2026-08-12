import { useState } from "react";
import type { contacts } from "../../types/contact/contact.model.type";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { onHandleBlockUser, onHandleUnBlockUser } from "../../redux/block.redux";
import { enqueueSnackbar } from "notistack";
import type { userBlocked } from "../../types/contact/contact.socket.type";


export function useBlock() {
  const [openModalBlock, setOpenModalBlock] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  const blockUsers = useSelector((state: RootState) => state.block.blockUsers);
  const unblockedIds = useSelector((state: RootState) => state.block.unblockedIds);

  const handleBlock = async (payload: contacts) => {
    try {
      await dispatch(onHandleBlockUser(payload.userId)).unwrap()
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Block user failed. Please try again", { variant: "error" });
    }
  };

  const handleUnblock = async (payload: contacts | userBlocked) => {
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
    data: {
      blockUsers,
      unblockedIds,
    },
    handlers: {
      setOpenModalBlock,
      handleBlock,
      handleUnblock,
    },
  };
}
