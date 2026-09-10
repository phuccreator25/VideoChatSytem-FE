export const compressImageHelper = async (
  file: File,
  maxWidth = 1920,
  quality = 0.8
): Promise<File> => {
  if (!file.type.startsWith("image/") || file.type === "image/gif") {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file);
    let { width, height } = bitmap;

    // Giữ nguyên tỷ lệ khung hình nếu vượt quá chiều rộng tối đa
    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return file;

    ctx.drawImage(bitmap, 0, 0, width, height);

    return new Promise((resolve) => {
      canvas.toBlob( // Gọi đến trình duyệt để nén các pixel trên canvas ra định dạng JPEG
        (blob) => {
          if (!blob) return resolve(file);

          const newFileName = file.name.replace(/\.[^/.]+$/, "") + ".jpg";
          resolve(
            new File([blob], newFileName, {
              type: "image/jpeg",
              lastModified: Date.now(),
            })
          );
        },
        "image/jpeg",
        quality
      );
    });
  } catch (error) {
    console.error("Image compression error:", error);
    return file;
  }
};

export const compressMultipleImagesHelper = (files: File[]): Promise<File[]> => {
  return Promise.all(files.map((file) => compressImageHelper(file)));
};
