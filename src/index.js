import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import QueryProvider from './services/QueryProvider';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryProvider>
      <App />
    </QueryProvider>
  </React.StrictMode>
);

reportWebVitals();
