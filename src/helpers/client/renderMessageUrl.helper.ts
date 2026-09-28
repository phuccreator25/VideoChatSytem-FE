import React from "react";
import { Link } from "@mui/material";

const renderMessageContent = (text: string, isLeft: boolean) => {
  if (!text) return "";

  // Regex phát hiện URL
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  
  // Tách chuỗi văn bản thành mảng dựa trên các URL tìm thấy
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    const isUrl = part.startsWith("http://") || part.startsWith("https://");
    if (isUrl) {
      return React.createElement(
        Link,
        {
          key: index,
          href: part,
          target: "_blank",
          rel: "noopener noreferrer",
          underline: "always",
          sx: {
            color: isLeft ? "#4f46e5" : "#a5b4fc",
            wordBreak: "break-all",
            fontWeight: 500,
            transition: "color 0.2s ease-in-out",
            "&:hover": {
              color: isLeft ? "#3730a3" : "#ffffff",
            },
          },
        },
        part
      );
    }
    // Nếu là chữ bình thường
    return part;
  });
};

export default renderMessageContent;