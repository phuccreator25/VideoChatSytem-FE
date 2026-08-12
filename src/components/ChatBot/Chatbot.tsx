import { useEffect, useRef } from 'react';
import {
  Drawer,
  Box,
  Typography,
  TextField,
  IconButton,
  Chip,
  Stack,
  Fab,
  Avatar,
  Tooltip,
  Paper,
} from '@mui/material';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import TagRoundedIcon from '@mui/icons-material/TagRounded';
import { useChatbot } from '../../hooks/Chatbot/chatbot.hook';

export interface ChatbotProps {
  isOpen?: boolean;
  onClose?: () => void;
  onToggle?: () => void;
}

// 🎨 Helper Component để Format Markdown (Bullet points, Bold text, Inline code, Line breaks)
function parseInlineMarkdown(text: string) {
  const regex = /(\*\*.*?\*\*|`.*?`)/g;
  const parts = text.split(regex);

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <Box component="span" key={i} sx={{ fontWeight: 700, color: '#f8fafc' }}>
          {part.slice(2, -2)}
        </Box>
      );
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <Box
          component="code"
          key={i}
          sx={{
            bgcolor: 'rgba(170, 59, 255, 0.15)',
            color: '#c084fc',
            px: 0.8,
            py: 0.2,
            mx: 0.3,
            borderRadius: '4px',
            fontFamily: 'Consolas, Monaco, monospace',
            fontSize: '0.82em',
            border: '1px solid rgba(170, 59, 255, 0.3)',
          }}
        >
          {part.slice(1, -1)}
        </Box>
      );
    }
    return part;
  });
}

function FormattedMarkdownMessage({ text }: { text: string }) {
  if (!text) return null;

  // Đảm bảo ngắt dòng cho các bullet point n8n dính liền nhau
  const formattedText = text
    .replace(/([^\n])\s*\*\s+\*\*/g, '$1\n* **')
    .replace(/([^\n])\s*-\s+\*\*/g, '$1\n- **');

  const lines = formattedText.split('\n');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();
        if (!trimmed) return <Box key={lineIdx} sx={{ height: 4 }} />;

        const isBullet = trimmed.startsWith('* ') || trimmed.startsWith('- ') || /^\d+\.\s/.test(trimmed);
        const content = isBullet
          ? trimmed.replace(/^(\*|-|\d+\.)\s*/, '')
          : trimmed;

        const parts = parseInlineMarkdown(content);

        if (isBullet) {
          return (
            <Box key={lineIdx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.2, pl: 0.5, my: 0.2 }}>
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: '#aa3bff',
                  mt: 0.9,
                  flexShrink: 0,
                  boxShadow: '0 0 8px #aa3bff',
                }}
              />
              <Typography variant="body2" sx={{ lineHeight: 1.65, fontSize: '0.88rem', color: '#f3f4f6', flex: 1 }}>
                {parts}
              </Typography>
            </Box>
          );
        }

        return (
          <Typography key={lineIdx} variant="body2" sx={{ lineHeight: 1.65, fontSize: '0.88rem', color: '#f3f4f6' }}>
            {parts}
          </Typography>
        );
      })}
    </Box>
  );
}

export default function Chatbot() {
  const { ui, data, handlers } = useChatbot();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [data.messages, ui.isOpen]);

  return (
    <>
      {/* 🟢 1A. RESTORE PILL WHEN TEMPORARILY HIDDEN */}
      {ui.isHidden && (
        <Tooltip title="AI Assistant" placement="left">
          <Chip
            label="✦ AI"
            onClick={() => ui.setIsHidden(false)}
            size="small"
            sx={{
              position: 'fixed',
              top: ui.topPos,
              right: 12,
              zIndex: 1250,
              bgcolor: 'rgba(170, 59, 255, 0.9)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.75rem',
              boxShadow: '0 4px 14px rgba(170, 59, 255, 0.4)',
              cursor: 'pointer',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              '&:hover': { bgcolor: '#aa3bff', transform: 'scale(1.08)' },
            }}
          />
        </Tooltip>
      )}

      {/* 🔮 1B. DRAGGABLE & HIDABLE CIRCULAR FAB TRIGGER */}
      {!ui.isHidden && (
        <Box
          sx={{
            position: 'fixed',
            top: ui.topPos,
            right: 28,
            zIndex: 1250,
            touchAction: 'none',
            '&:hover .hide-btn': { opacity: 1, transform: 'scale(1)' },
          }}
        >
          {/* Small Hide Button Badge on Hover */}
          <Tooltip title="Temporarily hide" placement="top">
            <IconButton
              className="hide-btn"
              onClick={(e) => {
                e.stopPropagation();
                ui.setIsHidden(true);
              }}
              size="small"
              sx={{
                position: 'absolute',
                top: -6,
                right: -6,
                zIndex: 1260,
                width: 20,
                height: 20,
                bgcolor: '#2b2d38',
                color: '#9ca3af',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                opacity: 0,
                transform: 'scale(0.6)',
                transition: 'all 0.2s ease-in-out',
                '&:hover': { bgcolor: '#ef4444', color: '#fff' },
              }}
            >
              <CloseRoundedIcon sx={{ fontSize: 12 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Drag vertically to move | Click to open AI" placement="left" arrow>
            <Fab
              onPointerDown={handlers.handlePointerDown}
              onClick={handlers.handleFabClick}
              aria-label="open-ai-chatbot"
              sx={{
                width: 52,
                height: 52,
                cursor: ui.isDragging ? 'grabbing' : 'grab',
                background: 'linear-gradient(135deg, #aa3bff 0%, #7c3aed 50%, #4f46e5 100%)',
                color: '#ffffff',
                boxShadow: '0 6px 20px rgba(170, 59, 255, 0.4), 0 0 12px rgba(170, 59, 255, 0.25)',
                transition: ui.isDragging ? 'none' : 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                animation: ui.isDragging ? 'none' : 'floatBounce 3.5s ease-in-out infinite',
                userSelect: 'none',
                '&:hover': {
                  transform: 'scale(1.1) rotate(6deg)',
                  boxShadow: '0 10px 28px rgba(170, 59, 255, 0.6), 0 0 18px rgba(170, 59, 255, 0.45)',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -4,
                  left: -4,
                  right: -4,
                  bottom: -4,
                  borderRadius: '50%',
                  border: '2px solid rgba(192, 132, 252, 0.45)',
                  animation: 'pulseRing 2.5s infinite ease-in-out',
                },
                '@keyframes pulseRing': {
                  '0%': { transform: 'scale(0.98)', opacity: 0.8 },
                  '50%': { transform: 'scale(1.18)', opacity: 0.15 },
                  '100%': { transform: 'scale(0.98)', opacity: 0.8 },
                },
                '@keyframes floatBounce': {
                  '0%, 100%': { transform: 'translateY(0)' },
                  '50%': { transform: 'translateY(-4px)' },
                },
              }}
            >
              <AutoAwesomeRoundedIcon sx={{ fontSize: 24, pointerEvents: 'none' }} />

              {/* Micro Active Dot Badge */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 3,
                  right: 3,
                  width: 9,
                  height: 9,
                  borderRadius: '50%',
                  bgcolor: '#34d399',
                  border: '2px solid #14151c',
                  boxShadow: '0 0 6px #34d399',
                }}
              />
            </Fab>
          </Tooltip>
        </Box>
      )}

      {/* 📱 2. MINIMALIST SLIDE-OVER CHAT DRAWER */}
      <Drawer
        anchor="right"
        open={ui.isOpen}
        onClose={handlers.handleClose}
        slotProps={{
          backdrop: {
            sx: {
              backdropFilter: 'blur(6px)',
              bgcolor: 'rgba(10, 11, 15, 0.45)',
            },
          },
        }}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 420, md: 450 },
            height: '100dvh',
            bgcolor: '#14151c',
            color: '#f3f4f6',
            borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '-12px 0 40px rgba(0, 0, 0, 0.65)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          },
        }}
      >
        {/* HEADER SECTION */}
        <Box
          sx={{
            p: 2.5,
            bgcolor: '#1a1b24',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, #aa3bff, transparent)',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              sx={{
                width: 42,
                height: 42,
                background: 'linear-gradient(135deg, #aa3bff 0%, #6366f1 100%)',
                boxShadow: '0 0 16px rgba(170, 59, 255, 0.5)',
              }}
            >
              <AutoAwesomeRoundedIcon sx={{ color: '#fff', fontSize: 22 }} />
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#f3f4f6', lineHeight: 1.2 }}>
                AI Call Assistant
              </Typography>
              <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                Smart call search & intelligent summary
              </Typography>
            </Box>
          </Box>

          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Clear chat history">
              <IconButton onClick={handlers.handleClearHistory} size="small" sx={{ color: '#9ca3af', '&:hover': { color: '#ef4444' } }}>
                <DeleteOutlineRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Close drawer">
              <IconButton onClick={handlers.handleClose} size="small" sx={{ color: '#9ca3af', '&:hover': { color: '#fff' } }}>
                <CloseRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>


        {/* CHAT MESSAGES STREAM */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            p: 2.5,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            bgcolor: '#14151c',
            '&::-webkit-scrollbar': { width: '6px' },
            '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px' },
          }}
        >
          {data.messages.map((msg) => (
            <Box
              key={msg.id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              {/* Sender Info Badge */}
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                {msg.sender === 'ai' ? (
                  <>
                    <SmartToyOutlinedIcon sx={{ fontSize: 14, color: '#c084fc' }} />
                    <Typography variant="caption" sx={{ color: '#c084fc', fontWeight: 600, fontSize: '0.72rem' }}>
                      AI Assistant
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 600, fontSize: '0.72rem' }}>
                      You
                    </Typography>
                    <PersonRoundedIcon sx={{ fontSize: 14, color: '#9ca3af' }} />
                  </>
                )}
                <Typography variant="caption" sx={{ color: '#4b5563', fontSize: '0.7rem' }}>
                  {msg.timestamp}
                </Typography>
              </Stack>

              {/* Message Bubble / Card */}
              <Paper
                elevation={0}
                sx={{
                  maxWidth: '90%',
                  p: 2,
                  borderRadius: msg.sender === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                  bgcolor: msg.sender === 'user' ? '#6366f1' : '#1e202c',
                  color: '#ffffff',
                  border: msg.sender === 'user' ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: msg.sender === 'user' ? '0 4px 14px rgba(99, 102, 241, 0.3)' : '0 4px 16px rgba(0,0,0,0.3)',
                }}
              >
                <FormattedMarkdownMessage text={msg.text} />

                {/* Optional Call Metadata Badge */}
                {msg.callMeta && (
                  <Box
                    sx={{
                      mt: 1.5,
                      p: 1.2,
                      bgcolor: 'rgba(170, 59, 255, 0.08)',
                      borderRadius: 1.5,
                      border: '1px solid rgba(170, 59, 255, 0.25)',
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                      <TagRoundedIcon sx={{ fontSize: 14, color: '#c084fc' }} />
                      <Typography variant="caption" sx={{ color: '#9ca3af', ml: 'auto' }}>
                        {msg.callMeta.date}
                      </Typography>
                    </Stack>
                    <Typography variant="caption" sx={{ color: '#d1d5db', display: 'block' }}>
                      👥 Participants: {msg.callMeta.participants.join(', ')}
                    </Typography>
                  </Box>
                )}

                {/* Optional Transcript Quotes Highlight */}
                {msg.quotes && msg.quotes.length > 0 && (
                  <Box sx={{ mt: 1.5 }}>
                    {msg.quotes.map((q, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          p: 1,
                          mb: 0.8,
                          bgcolor: 'rgba(0, 0, 0, 0.25)',
                          borderLeft: '3px solid #aa3bff',
                          borderRadius: '0 6px 6px 0',
                        }}
                      >
                        <Typography variant="caption" sx={{ fontStyle: 'italic', color: '#e5e7eb', fontSize: '0.78rem' }}>
                          {q}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}

                {/* Copy Text Action */}
                {msg.sender === 'ai' && (
                  <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1 }}>
                    <Tooltip title="Copy message">
                      <IconButton size="small" sx={{ color: '#6b7280', p: 0.3, '&:hover': { color: '#c084fc' } }}>
                        <ContentCopyRoundedIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                )}
              </Paper>
            </Box>
          ))}
          {/* Thẻ neo tự động cuộn xuống cuối */}
          <div ref={messagesEndRef} />
        </Box>

        {/* INPUT FOOTER SECTION */}
        <Box
          sx={{
            p: 2,
            bgcolor: '#1a1b24',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: '#14151c',
              borderRadius: 3,
              border: '1px solid rgba(255, 255, 255, 0.12)',
              px: 1.5,
              py: 0.5,
              transition: 'border-color 0.2s',
              '&:focus-within': {
                borderColor: '#aa3bff',
                boxShadow: '0 0 12px rgba(170, 59, 255, 0.25)',
              },
            }}
          >
            <TextField
              fullWidth
              placeholder="Ask a question about call data..."
              variant="standard"
              value={data.question}
              onChange={(e) => handlers.setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handlers.handleSend();
                }
              }}
              InputProps={{
                disableUnderline: true,
                sx: {
                  color: '#ffffff',
                  fontSize: '0.88rem',
                  py: 0.5,
                },
              }}
            />
            <IconButton
              onClick={handlers.handleSend}
              disabled={!data.question.trim()}
              sx={{
                bgcolor: data.question.trim() ? '#aa3bff' : 'rgba(255, 255, 255, 0.05)',
                color: data.question.trim() ? '#ffffff' : '#4b5563',
                ml: 1,
                width: 36,
                height: 36,
                '&:hover': {
                  bgcolor: data.question.trim() ? '#9333ea' : 'rgba(255, 255, 255, 0.05)',
                },
              }}
            >
              <SendRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>

          <Typography variant="caption" sx={{ color: '#4b5563', fontSize: '0.7rem', display: 'block', textAlign: 'center', mt: 1 }}>
            AI Assistant for searching and summarizing call transcripts
          </Typography>
        </Box>
      </Drawer>
    </>
  );
}
