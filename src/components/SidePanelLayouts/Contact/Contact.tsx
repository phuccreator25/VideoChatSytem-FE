import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";

import { customScrollbarSx } from "../../../utils/CustomScroll";
import { AlphabetIndex } from "./Alphabet/AlphabetIndex.contact";
import ModalAddContactModal from "./ModalAddContact/ModalAddContact.contact";
import useInvitation from "../../../hooks/Invitation/Invitation.hook";
import { InvitationPopover } from "./Invitation/InvitationPopover";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import { useContact } from "../../../hooks/Contact/contact.hook";


export function ContactsView() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const countReceived = useSelector(
    (state: RootState) => state.invitation.countReceived
  );

  const {
    openModal,
    anchorEl,
    openPopover,
    receivedInvitations,
    sentInvitations,
    setSentInvitations,
    setReceivedInvitations,
    getTimeAgo,
    handleOpenInvitationPopover,
    handleCloseInvitationPopover,
    handleAcceptInvitation,
    handleDeclineInvitation,
    handleCancelSentInvitation,
    handleOpenAddContactModal,
    handleViewAllRequests,
    handleCloseModal,
    onHandleAddContact,
    handleRemoveReceivedInvitation,
    handleRemoveSentInvitation
  } = useInvitation();

  const {
    contactsAfterFilter,
    searchValue,
    setSearchValue,
    anchorElRowAction,
    handleClosePopover,
    handleOpenPopover,
    setOpenSetNicknameModal,
    openSetNicknameModal,
    onUpdateNickName,
    selectedContact,
    setSelectedContact
  } = useContact()
  return (
    <Box
      sx={{
        height: "100%",
        minHeight: 0,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          height: "100%",
          borderRadius: { xs: 0, sm: 4 },
          bgcolor: "#ffffff",
          border: { xs: "none", sm: "1px solid #ebecef" },
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            px: { xs: 2, sm: 3 },
            pt: { xs: 2, sm: 3 },
            pb: 2,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Typography
              sx={{
                fontSize: { xs: 22, sm: 26 },
                fontWeight: 700,
                color: "#1f2430",
                lineHeight: 1.1,
              }}
            >
              Contacts
            </Typography>

            <Badge
              badgeContent={countReceived}
              color="error"
              max={99}
              overlap="circular"
              invisible={countReceived === 0}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <IconButton
                onClick={handleOpenInvitationPopover}
                sx={{
                  color: "#7d84a0",
                  "&:hover": {
                    bgcolor: "rgba(111, 99, 246, 0.08)",
                    color: "#6f63f6",
                  },
                }}
              >
                <PersonAddAlt1RoundedIcon sx={{ fontSize: 22 }} />
              </IconButton>
            </Badge>
          </Stack>

          <Box
            sx={{
              mt: 3,
              height: 46,
              px: 2,
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              bgcolor: "#f3f5fb",
              border: "1px solid transparent",
              transition: "all 0.2s ease",
              "&:focus-within": {
                borderColor: "rgba(111, 99, 246, 0.35)",
                bgcolor: "#ffffff",
              },
            }}
          >
            <SearchRoundedIcon
              sx={{
                fontSize: 20,
                color: "#8a91a3",
              }}
            />

            <InputBase
              placeholder="Search users.."
              fullWidth
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              sx={{
                fontSize: 15,
                color: "#1f2430",
                "& input::placeholder": {
                  color: "#8a91a3",
                  opacity: 1,
                },
              }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            px: { xs: 1.25, sm: 2 },
            pb: { xs: 1.25, sm: 2 },
            ...customScrollbarSx,
          }}
        >
          {contactsAfterFilter.map((section) => (
            <AlphabetIndex 
            key={section.key} 
            section={section} 
            anchorEl={anchorElRowAction} 
            handleClosePopover={handleClosePopover} 
            handleOpenPopover={handleOpenPopover} 
            setOpenSetNicknameModal={setOpenSetNicknameModal}
            openSetNicknameModal={openSetNicknameModal}
            onUpdateNickName={onUpdateNickName}
            selectedContact={selectedContact}
            setSelectedContact={setSelectedContact}
            />
          ))}

          {contactsAfterFilter.length === 0 && (
            <Box
              sx={{
                py: 6,
                textAlign: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: 15,
                  color: "#8a91a3",
                }}
              >
                No contacts found
              </Typography>
            </Box>
          )}

          {isMobile && <Box sx={{ height: 12 }} />}
        </Box>

        <InvitationPopover
          openPopover={openPopover}
          anchorEl={anchorEl}
          handleCloseInvitationPopover={handleCloseInvitationPopover}
          handleOpenAddContactModal={handleOpenAddContactModal}
          receivedInvitations={receivedInvitations}
          setReceivedInvitations={setReceivedInvitations}
          handleDeclineInvitation={handleDeclineInvitation}
          handleAcceptInvitation={handleAcceptInvitation}
          sentInvitations={sentInvitations}
          getTimeAgo={getTimeAgo}
          handleCancelSentInvitation={handleCancelSentInvitation}
          handleViewAllRequests={handleViewAllRequests}
          handleRemoveReceivedInvitation={handleRemoveReceivedInvitation}
          handleRemoveSentInvitation={handleRemoveSentInvitation}
          setSentInvitations={setSentInvitations}
        />

        <ModalAddContactModal
          open={openModal}
          onClose={handleCloseModal}
          onSubmit={onHandleAddContact}
          onAcceptRequest={handleAcceptInvitation}
          onDeclineRequest={handleDeclineInvitation}
          onCancelInvitation={handleCancelSentInvitation}
        />
      </Paper>
    </Box>
  );
}