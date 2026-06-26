import { Box, IconButton, Tooltip } from "@mui/material";
import type { InvitationQuickAction } from "../../../../types/invitation/invitation.model.type";
import type { UserOption } from "../../../../types/invitation/invitation.form.type";

type QuickActionButtonProps = {
  title: string;
  action: InvitationQuickAction;
  option: UserOption;
  color: string;
  bgcolor: string;
  hoverBgcolor: string;
  icon: React.ReactNode;
  onAction: (
    event: React.SyntheticEvent,
    option: UserOption,
    action: InvitationQuickAction
  ) => void;
};

const QuickActionButton = ({
  title,
  action,
  option,
  color,
  bgcolor,
  hoverBgcolor,
  icon,
  onAction,
}: QuickActionButtonProps) => {
  return (
    <Tooltip title={title}>
      <Box
        onPointerDownCapture={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onAction(e, option, action);
        }}
        sx={{ display: "inline-flex" }}
      >
        <IconButton
          size="small"
          type="button"
          sx={{
            width: 30,
            height: 30,
            bgcolor,
            color,
            "&:hover": {
              bgcolor: hoverBgcolor,
            },
          }}
        >
          {icon}
        </IconButton>
      </Box>
    </Tooltip>
  );
};

export default QuickActionButton
