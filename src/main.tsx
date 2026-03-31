import { createRoot } from 'react-dom/client'
import { SnackbarProvider } from 'notistack'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <SnackbarProvider
    maxSnack={3}
    autoHideDuration={3000}
    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
  >
    <App />
  </SnackbarProvider>
)