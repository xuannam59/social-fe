import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@social/styles/index.css';
import App from './App.tsx';
import { Provider } from 'react-redux';
import { store } from '@social/redux/stores.ts';

const root = createRoot(document.getElementById('root')!);
root.render(
  <Provider store={store}>
    {/* <StrictMode> */}
      <App />
    {/* </StrictMode> */}
  </Provider>
);
