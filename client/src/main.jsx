import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { store} from './redux/store.js';
import { Provider } from 'react-redux';

import ThemeProvider from './components/ThemeProvider.jsx';
import { ToastProvider } from './contexts/ToastContext.jsx';
import { NotificationProvider } from './contexts/NotificationContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  
  <Provider store={store}>
    <ThemeProvider>
    <ToastProvider>
    <NotificationProvider>
    <App />
    </NotificationProvider>
    </ToastProvider>
    </ThemeProvider>
  </Provider>
 
)