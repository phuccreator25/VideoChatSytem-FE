import { useEffect } from 'react'
import { Provider } from 'react-redux'
import './App.css'
import ClientRoute from './routes/Client/Client.route.tsx'
import { persistor, store } from './redux/store.ts'
import { PersistGate } from 'redux-persist/integration/react'
import { initTabNotification } from './helpers/tabNotification'

function App() {
  useEffect(() => {
    initTabNotification();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ClientRoute />
      </PersistGate>
    </Provider>
  )
}

export default App
