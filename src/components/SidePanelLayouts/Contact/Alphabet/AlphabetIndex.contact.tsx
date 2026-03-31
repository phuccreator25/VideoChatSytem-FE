import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";

import { ContactRow } from "../ContactRow/ContactRow.contact";
import type { ContactSection } from "../../../../types/data.type";

export function AlphabetIndex({ section }: { section: ContactSection }) {
  return (
    <Box sx={{ mb: 2.5 }}>
      <Typography
        sx={{
          px: 1.5,
          pb: 1,
          pt: 1,
          fontSize: 12,
          fontWeight: 800,
          color: '#6f63f6',
          letterSpacing: 0.4,
        }}
      >
        {section.letter}aaa
      </Typography>

      <List disablePadding>
        {section.items.map((item) => (
          <ContactRow key={item.key} item={item} />
        ))}
      </List>
    </Box>
  );
}
