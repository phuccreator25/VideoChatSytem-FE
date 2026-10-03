import { useEffect, Suspense } from 'react';
import { Provider } from 'react-redux';
import './App.css';
import { persistor, store } from './redux/store.ts';
import { PersistGate } from 'redux-persist/integration/react';
import { initTabNotification } from './helpers/client/tabNotification.ts';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ClientRoute from './routes/Client/Client.route.tsx';
import AdminRoute from './routes/Admin/Admin.route.tsx';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const PageLoadingFallback = () => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      width: "100%",
      bgcolor: "background.default",
    }}
  >
    <CircularProgress size={40} />
  </Box>
);

function App() {
  useEffect(() => {
    initTabNotification();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Suspense fallback={<PageLoadingFallback />}>
            <Routes>
              <Route path="/admin/*" element={<AdminRoute />} />
              <Route path="/*" element={<ClientRoute />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
