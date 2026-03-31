import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
const features = [
  {
    icon: <ChatRoundedIcon fontSize="small" />,
    label: 'Chat thời gian thực',
  },
  {
    icon: <VideocamRoundedIcon fontSize="small" />,
    label: 'Video call mượt',
  },
  {
    icon: <SecurityRoundedIcon fontSize="small" />,
    label: 'Bảo mật tài khoản',
  },
  {
    icon: <BoltRoundedIcon fontSize="small" />,
    label: 'Phản hồi nhanh',
  },
];

export default function AuthLayout() {
  return (
    <Box
    sx={{
        minHeight: '100vh',
        fontFamily: '"Be Vietnam Pro", "Inter", "Roboto", sans-serif',
        background: `
          radial-gradient(circle at top left, rgba(59,130,246,0.10) 0%, transparent 22%),
          radial-gradient(circle at bottom right, rgba(125,211,252,0.12) 0%, transparent 24%),
          linear-gradient(180deg, #ffffff 0%, #f7fbff 52%, #f2f8ff 100%)
        `,
        position: 'relative',
        overflow: 'hidden',
      }}
      >
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          left: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(96,165,250,0.16) 0%, rgba(96,165,250,0) 72%)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -120,
          right: -80,
          width: 340,
          height: 340,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(125,211,252,0.18) 0%, rgba(125,211,252,0) 72%)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <Box
          sx={{
            minHeight: 'calc(100vh - 40px)',
            display: 'grid',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1.05fr 0.95fr' },
              gap: 3,
              alignItems: 'stretch',
            }}
          >
            <Card
              elevation={0}
              sx={{
                display: { xs: 'none', md: 'flex' },
                borderRadius: 6,
                p: 0,
                minHeight: 620,
                color: '#123',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid rgba(147, 197, 253, 0.35)',
                background:
                  'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(247,251,255,0.98) 58%, rgba(239,248,255,0.98) 100%)',
                boxShadow: '0 24px 80px rgba(59, 130, 246, 0.08)',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'radial-gradient(circle at top right, rgba(59,130,246,0.08), transparent 30%), radial-gradient(circle at bottom left, rgba(125,211,252,0.08), transparent 28%)',
                }}
              />
              <CardContent
                sx={{
                  position: 'relative',
                  zIndex: 1,
                  p: 5,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Chip
                    label="Realtime video chat"
                    sx={{
                      mb: 3,
                      fontWeight: 600,
                      fontFamily: 'inherit',
                      color: '#1565c0',
                      backgroundColor: 'rgba(33, 150, 243, 0.08)',
                      border: '1px solid rgba(33, 150, 243, 0.14)',
                    }}
                  />

                  <Typography
                    variant="h3"
                    sx={{
                      fontFamily: 'inherit',
                      fontWeight: 700,
                      lineHeight: 1.22,
                      letterSpacing: '-0.01em',
                      color: '#0f172a',
                      mb: 2,
                    }}
                  >
                    Kết nối team nhanh hơn với chat và video call realtime
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: 'inherit',
                      maxWidth: 520,
                      color: '#475569',
                      fontSize: '1rem',
                      lineHeight: 1.8,
                      fontWeight: 400,
                      mb: 4,
                    }}
                  >
                    Không gian làm việc hiện đại cho nhắn tin, họp video, trao đổi
                    nhanh và cộng tác mượt mà trong một nền tảng thống nhất.
                  </Typography>

                  <Stack direction="row" flexWrap="wrap" gap={1.2}>
                    {features.map((item) => (
                      <Chip
                        key={item.label}
                        icon={item.icon}
                        label={item.label}
                        sx={{
                          px: 1,
                          py: 2.2,
                          borderRadius: 999,
                          bgcolor: 'rgba(255,255,255,0.94)',
                          color: '#334155',
                          border: '1px solid rgba(191, 219, 254, 0.7)',
                          fontWeight: 500,
                          fontFamily: 'inherit',
                          '& .MuiChip-icon': {
                            color: '#1976d2',
                          },
                        }}
                      />
                    ))}
                  </Stack>
                </Box>

                <Box
                  sx={{
                    mt: 4,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 2,
                  }}
                >
                  {[
                    { value: '99.9%', label: 'Kết nối ổn định' },
                    { value: '<200ms', label: 'Phản hồi nhanh' },
                    { value: '24/7', label: 'Luôn sẵn sàng' },
                  ].map((item) => (
                    <Box
                      key={item.label}
                      sx={{
                        p: 2.2,
                        borderRadius: 4,
                        bgcolor: 'rgba(255,255,255,0.92)',
                        border: '1px solid rgba(191, 219, 254, 0.5)',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: 'inherit',
                          fontSize: 24,
                          fontWeight: 700,
                          color: '#0f172a',
                          mb: 0.5,
                        }}
                      >
                        {item.value}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: 'inherit',
                          color: '#64748b',
                          fontWeight: 400,
                        }}
                      >
                        {item.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>

            <Card
              elevation={0}
              sx={{
                borderRadius: 6,
                minHeight: { xs: 'auto', md: 620 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(191, 219, 254, 0.45)',
                background: 'rgba(255,255,255,0.97)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 24px 80px rgba(59, 130, 246, 0.06)',
              }}
            >
              <CardContent
                sx={{
                  width: '100%',
                  maxWidth: 460,
                  p: { xs: 3, sm: 4.5 },
                  fontFamily: 'inherit',
                }}
              >
                <Box sx={{ mb: 3, display: { xs: 'block', md: 'none' } }}>
                  <Chip
                    label="Chat app video realtime"
                    sx={{
                      mb: 2,
                      fontWeight: 600,
                      fontFamily: 'inherit',
                      color: '#1565c0',
                      backgroundColor: 'rgba(33, 150, 243, 0.08)',
                    }}
                  />
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: 'inherit',
                      fontWeight: 700,
                      color: '#0f172a',
                      mb: 1,
                    }}
                  >
                    Chào mừng bạn quay lại
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: 'inherit',
                      color: '#64748b',
                      fontWeight: 400,
                    }}
                  >
                    Đăng nhập để tiếp tục trò chuyện và kết nối với mọi người.
                  </Typography>
                </Box>

                <Outlet />
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}