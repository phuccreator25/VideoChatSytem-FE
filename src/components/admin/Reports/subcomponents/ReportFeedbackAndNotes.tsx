import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

type ReportFeedbackAndNotesProps = {
  feedbackText: string;
  setFeedbackText: (value: string) => void;
  internalNotes: string;
  setInternalNotes: (value: string) => void;
}

export const ReportFeedbackAndNotes = ({
  feedbackText,
  setFeedbackText,
  internalNotes,
  setInternalNotes,
} : ReportFeedbackAndNotesProps) => {
  return (
    <>
      {/* Section 4: Phản hồi gửi cho Reporter */}
      <Box>
        <Typography
          sx={{
            fontSize: "0.85rem",
            fontWeight: 700,
            color: "#0F172A",
            mb: 1,
          }}
        >
          3. FEEDBACK TO REPORTER (Max 500):
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={3}
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
          placeholder="Enter transparent feedback for the reporter..."
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              fontSize: "0.825rem",
              bgcolor: "#FFFFFF",
              "& fieldset": {
                borderColor: "#E2E8F0",
              },
              "&:hover fieldset": {
                borderColor: "#CBD5E1",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#7C3AED",
              },
            },
          }}
        />
      </Box>

      {/* Section 5: Ghi chú nội bộ BQT */}
      <Box>
        <Typography
          sx={{
            fontSize: "0.85rem",
            fontWeight: 700,
            color: "#0F172A",
            mb: 1,
          }}
        >
          4. INTERNAL NOTES:
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={2.5}
          value={internalNotes}
          onChange={(e) => setInternalNotes(e.target.value)}
          placeholder="Internal notes..."
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              fontSize: "0.825rem",
              bgcolor: "#FFFFFF",
              "& fieldset": {
                borderColor: "#E2E8F0",
              },
              "&:hover fieldset": {
                borderColor: "#CBD5E1",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#7C3AED",
              },
            },
          }}
        />
      </Box>
    </>
  );
};
