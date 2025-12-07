import { createRoot } from 'react-dom/client';
import '@social/styles/index.css';
import App from './App.tsx';
import { Provider } from 'react-redux';
import { store } from '@social/redux/stores.ts';
import { StrictMode } from 'react';

const root = createRoot(document.getElementById('root')!);
root.render(
  <Provider store={store}>
    <StrictMode>
      <App />
    </StrictMode>
  </Provider>
);
