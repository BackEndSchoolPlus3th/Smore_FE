import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../ui/index.css';
import App from './App.tsx';
import { Provider } from 'react-redux';
import { store } from '../../shared/index.ts';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </StrictMode>
);
