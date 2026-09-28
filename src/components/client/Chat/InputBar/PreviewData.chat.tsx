import FolderZipRoundedIcon from "@mui/icons-material/FolderZipRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import MovieRoundedIcon from "@mui/icons-material/MovieRounded";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import TableChartRoundedIcon from "@mui/icons-material/TableChartRounded";
import SlideshowRoundedIcon from "@mui/icons-material/SlideshowRounded";
import TextSnippetRoundedIcon from "@mui/icons-material/TextSnippetRounded";

type PreviewKind =
  | "image"
  | "video"
  | "pdf"
  | "word"
  | "excel"
  | "powerpoint"
  | "archive"
  | "text"
  | "document";

export function getPreviewMeta(kind: PreviewKind, extension: string) {
  switch (kind) {
    case "image":
      return {
        label: "Image",
        badge: extension.replace(".", "").toUpperCase() || "IMG",
        icon: null,
        bg: "linear-gradient(180deg, rgba(15,23,42,0) 0%, rgba(15,23,42,0.72) 100%)",
        iconBg: "",
        iconColor: "",
      };
    case "video":
      return {
        label: "Video",
        badge: extension.replace(".", "").toUpperCase() || "VIDEO",
        icon: <MovieRoundedIcon sx={{ fontSize: 30 }} />,
        bg: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
        iconBg: "rgba(37, 99, 235, 0.14)",
        iconColor: "#1d4ed8",
      };
    case "pdf":
      return {
        label: "PDF",
        badge: "PDF",
        icon: <PictureAsPdfRoundedIcon sx={{ fontSize: 30 }} />,
        bg: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
        iconBg: "rgba(220, 38, 38, 0.14)",
        iconColor: "#b91c1c",
      };
    case "word":
      return {
        label: "Word",
        badge: extension.replace(".", "").toUpperCase() || "DOC",
        icon: <DescriptionRoundedIcon sx={{ fontSize: 30 }} />,
        bg: "linear-gradient(135deg, #dbeafe 0%, #d6e4ff 100%)",
        iconBg: "rgba(37, 99, 235, 0.14)",
        iconColor: "#1d4ed8",
      };
    case "excel":
      return {
        label: "Excel",
        badge: extension.replace(".", "").toUpperCase() || "XLS",
        icon: <TableChartRoundedIcon sx={{ fontSize: 30 }} />,
        bg: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
        iconBg: "rgba(22, 163, 74, 0.14)",
        iconColor: "#15803d",
      };
    case "powerpoint":
      return {
        label: "Slides",
        badge: extension.replace(".", "").toUpperCase() || "PPT",
        icon: <SlideshowRoundedIcon sx={{ fontSize: 30 }} />,
        bg: "linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)",
        iconBg: "rgba(234, 88, 12, 0.14)",
        iconColor: "#c2410c",
      };
    case "archive":
      return {
        label: "Archive",
        badge: extension.replace(".", "").toUpperCase() || "ZIP",
        icon: <FolderZipRoundedIcon sx={{ fontSize: 30 }} />,
        bg: "linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)",
        iconBg: "rgba(109, 40, 217, 0.14)",
        iconColor: "#7c3aed",
      };
    case "text":
      return {
        label: "Text",
        badge: extension.replace(".", "").toUpperCase() || "TXT",
        icon: <TextSnippetRoundedIcon sx={{ fontSize: 30 }} />,
        bg: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
        iconBg: "rgba(202, 138, 4, 0.14)",
        iconColor: "#a16207",
      };
    default:
      return {
        label: "Document",
        badge: extension.replace(".", "").toUpperCase() || "FILE",
        icon: <DescriptionRoundedIcon sx={{ fontSize: 30 }} />,
        bg: "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)",
        iconBg: "rgba(71, 85, 105, 0.14)",
        iconColor: "#475569",
      };
  }
}