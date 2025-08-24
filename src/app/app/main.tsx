import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../../shared/store/store'// 기존 redux 설정
import { rootStore, StoreProvider } from '../../features/videoChat/stores/StoreContext' // MobX 설정
import App from './App';
import '../ui/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StoreProvider value={rootStore}>
          <App />
        </StoreProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);