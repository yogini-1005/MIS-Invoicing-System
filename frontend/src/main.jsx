import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { InvoiceProvider } from './context/InvoiceContext';
import { UserProvider } from './context/UserContext';  
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <UserProvider> 
      <InvoiceProvider>
        <App />
      </InvoiceProvider>
    </UserProvider>
  </BrowserRouter>
);
