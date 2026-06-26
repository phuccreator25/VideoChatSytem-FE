import { enqueueSnackbar } from "notistack";

export default function useDownloadFile() {
  const onHandleDownloadFile = async (url: string, fileName = "download") => {
    try {
      if (!url) return;
      console.log(url);
      

      const res = await fetch(url);

      if (!res.ok) {
        enqueueSnackbar("Download Failed", {
          variant: "error",
        });
      }

      const blob = await res.blob();
      const blobUrl = await URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error: any) {
      console.log("DOWNLOAD ERROR: ", error);
      enqueueSnackbar("DownLoad Failed. Please try again", {
        variant: "error",
      });
    }
  };

  return {
    onHandleDownloadFile,
  };
}
