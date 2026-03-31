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
import type { ContactSection } from "../../../types/data.type";
import { AlphabetIndex } from "./Alphabet/AlphabetIndex.contact";

const contactSections: ContactSection[] = [
  {
    key: "a",
    letter: "A",
    items: [
      {
        key: "albert-rodarte",
        name: "Albert Rodarte",
        onClick: () => {
          console.log("Albert Rodarte");
        },
      },
      {
        key: "allison-etter",
        name: "Allison Etter",
        onClick: () => {
          console.log("Allison Etter");
        },
      },
    ],
  },
  {
    key: "c",
    letter: "C",
    items: [
      {
        key: "craig-smiley",
        name: "Craig Smiley",
        onClick: () => {
          console.log("Craig Smiley");
        },
      },
    ],
  },
  {
    key: "d",
    letter: "D",
    items: [
      {
        key: "daniel-clay",
        name: "Daniel Clay",
        onClick: () => {
          console.log("Daniel Clay");
        },
      },
      {
        key: "doris-brown",
        name: "Doris Brown",
        onClick: () => {
          console.log("Doris Brown");
        },
      },
    ],
  },
  {
    key: "i",
    letter: "I",
    items: [
      {
        key: "iris-wells",
        name: "Iris Wells",
        onClick: () => {
          console.log("Iris Wells");
        },
      },
    ],
  },
  {
    key: "j",
    letter: "J",
    items: [
      {
        key: "juan-flakes",
        name: "Juan Flakes",
        onClick: () => {
          console.log("Juan Flakes");
        },
      },
      {
        key: "john-hall",
        name: "John Hall",
        onClick: () => {
          console.log("John Hall");
        },
      },
      {
        key: "joy-southern",
        name: "Joy Southern",
        onClick: () => {
          console.log("Joy Southern");
        },
      },
    ],
  },
  {
    key: "m",
    letter: "M",
    items: [
      {
        key: "mary-farmer",
        name: "Mary Farmer",
        onClick: () => {
          console.log("Mary Farmer");
        },
      },
      {
        key: "mark-messer",
        name: "Mark Messer",
        onClick: () => {
          console.log("Mark Messer");
        },
      },
      {
        key: "michael-hinton",
        name: "Michael Hinton",
        onClick: () => {
          console.log("Michael Hinton");
        },
      },
    ],
  },
  {
    key: "o",
    letter: "O",
    items: [
      {
        key: "ossie-wilson",
        name: "Ossie Wilson",
        onClick: () => {
          console.log("Ossie Wilson");
        },
      },
    ],
  },
];

export function ContactsView() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

            <IconButton
              sx={{
                color: "#7d84a0",
                "&:hover": {
                  bgcolor: "rgba(111, 99, 246, 0.08)",
                  color: "#6f63f6",
                },
              }}
              onClick={() => {
                console.log("add-contact");
              }}
            >
              <PersonAddAlt1RoundedIcon sx={{ fontSize: 22 }} />
            </IconButton>
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
          {contactSections.map((section) => (
            <AlphabetIndex key={section.key} section={section} />
          ))}

          {isMobile && <Box sx={{ height: 12 }} />}
        </Box>
      </Paper>
    </Box>
  );
}
