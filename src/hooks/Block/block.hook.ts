import { useState } from "react";
import BlockApi from "../../api/Block.api";
import type { contacts } from "../../types/contact.type";

export function useBlock() {
  const [openModalBlock, setOpenModalBlock] = useState<boolean>(false);

  const handleBlock = async (payload: contacts) => {
    try {
      const res = await BlockApi.onBlock(payload);
      return res.status === 201;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const handleUnblock = async (payload: contacts) => {
    try {
      const res = await BlockApi.onUnblock(payload);
      return res.status === 201;
    } catch (error) {
      console.log(error);
      return false;
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