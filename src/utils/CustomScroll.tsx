export const customScrollbarSx = {
  scrollbarWidth: 'thin',
  scrollbarColor: '#cfd5e3 transparent',
  '&::-webkit-scrollbar': {
    width: '8px',
    height: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
    borderRadius: '999px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#cfd5e3',
    borderRadius: '999px',
    border: '2px solid transparent',
    backgroundClip: 'padding-box',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: '#b8c0d4',
  },
};
